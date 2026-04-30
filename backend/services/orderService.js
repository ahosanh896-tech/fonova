import mongoose from "mongoose";
import orderModel from "../models/orderModel.js";
import productModel from "../models/productModel.js";
import { orderQueue } from "../queues/orderQueue.js";

export const createOrderService = async ({
  userId,
  orderItems,
  shippingAddress,
  paymentMethod,
  paymentStatus,
  paymentResult,
}) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const productIds = orderItems.map((i) => i.product);

    const products = await productModel
      .find({ _id: { $in: productIds } })
      .session(session);

    let itemsPrice = 0;

    const updatedItems = orderItems.map((item) => {
      const product = products.find((p) => p._id.toString() === item.product);

      if (!product) throw new Error("Product not found");

      if (product.stock < item.quantity) {
        throw new Error(`${product.name} out of stock`);
      }

      const price = product.finalPrice || product.price;

      itemsPrice += price * item.quantity;

      return {
        product: product._id,
        name: product.name,
        image: product.images[0]?.url,
        price,
        quantity: item.quantity,
      };
    });

    // atomic stock update
    for (const item of orderItems) {
      const result = await productModel.updateOne(
        { _id: item.product, stock: { $gte: item.quantity } },
        {
          $inc: {
            stock: -item.quantity,
            sold: item.quantity,
          },
        },
        { session },
      );

      if (result.modifiedCount === 0) {
        throw new Error("Stock update failed");
      }
    }

    const shippingPrice = itemsPrice > 500 ? 0 : 50;
    const totalPrice = itemsPrice + shippingPrice;

    const order = new orderModel({
      user: userId,
      orderItems: updatedItems,
      shippingAddress,
      paymentMethod,
      paymentStatus,
      paymentResult,
      itemsPrice,
      shippingPrice,
      totalPrice,
    });

    await order.save({ session });

    await session.commitTransaction();
    session.endSession();

    orderQueue
      .add(
        "order-created",
        {
          orderId: order._id.toString(),
          userId: order.user.toString(),
          email: shippingAddress?.email || null,
          total: totalPrice,
        },
        {
          attempts: 3,
          backoff: 5000,
        },
      )
      .catch((err) => {
        console.error("Queue error:", err);
      });

    return order;
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
};
