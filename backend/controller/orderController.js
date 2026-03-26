import orderModel from "../models/orderModel.js";
import productModel from "../models/productModel.js";

import orderModel from "../models/orderModel.js";
import productModel from "../models/productModel.js";

export const placeOrder = async (req, res) => {
  try {
    const { orderItems, shippingAddress, paymentMethod = "COD" } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No order items",
      });
    }

    // fetch order
    const productIds = orderItems.map((item) => item.product);

    const products = await productModel.find({
      _id: { $in: productIds },
    });

    let itemsPrice = 0;
    //order item
    const updatedItems = orderItems.map((item) => {
      const product = products.find((p) => p._id.toString() === item.product);

      if (!product) {
        throw new Error("One or more products not found");
      }

      //stock check
      if (product.stock < item.quantity) {
        throw new Error(`${product.name} is out of stock`);
      }

      //price calculate
      const price = product.price - (product.price * product.discount) / 100;

      itemsPrice += price * item.quantity;

      return {
        product: product._id,
        name: product.name,
        image: product.images[0]?.url || "",
        price,
        quantity: item.quantity,
        variant: item.variant || {},
      };
    });

    //update stock and sold
    for (const item of orderItems) {
      const product = products.find((p) => p._id.toString() === item.product);

      if (!product) continue; // safety (already checked above)

      product.stock -= item.quantity;
      product.sold += item.quantity;

      await product.save();
    }

    const taxPrice = 0;
    const shippingPrice = itemsPrice > 500 ? 0 : 50;
    const totalPrice = itemsPrice + taxPrice + shippingPrice;

    const order = new orderModel({
      user: req.user._id,
      orderItems: updatedItems,
      shippingAddress,
      paymentMethod,
      paymentStatus: "pending",
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    const createdOrder = await order.save();

    res.status(201).json({
      success: true,
      message: "Order placed successfully (COD)",
      order: createdOrder,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const orderStripe = async (req, res) => {};

export const verifyStripe = async (req, res) => {};

export const getUserOrders = async (req, res) => {};

export const getSingleOrder = async (req, res) => {};

export const updateOrderStatus = async (req, res) => {};

export const updatePaymentStatus = async (req, res) => {};

export const cancelOrder = async (req, res) => {};

export const deleteOrder = async (req, res) => {};

export const markAsDelivered = async (req, res) => {};
