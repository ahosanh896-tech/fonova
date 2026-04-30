import { stripe } from "../config/stripe.js";
import productModel from "../models/productModel.js";
import orderModel from "../models/orderModel.js";
import { createOrderService } from "../services/orderService.js";

export const createStripeSession = async (req, res) => {
  try {
    const userId = req.user._id;
    const { items, address } = req.body;
    const { origin } = req.headers;

    const line_items = [];

    for (const item of items) {
      const productId = item._id || item.productId?._id;
      if (!productId) {
        throw new Error("Invalid item data");
      }

      const product = await productModel.findById(productId);

      if (!product) throw new Error("Product not found");

      line_items.push({
        price_data: {
          currency: "usd",
          product_data: { name: product.name },
          unit_amount: Math.round(product.finalPrice * 100),
        },
        quantity: item.quantity,
      });
    }

    const metadataItems = items
      .map((item) => {
        const productId = item._id || item.productId?._id;
        return `${productId}:${item.quantity}`;
      })
      .join(",");

    const email = address.email || req.user.email || null;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items,
      ...(email ? { customer_email: email } : {}),

      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cancel`,

      metadata: {
        userId: userId.toString(),
        items: metadataItems,
        address: JSON.stringify(address),
        ...(email ? { email } : {}),
      },
    });

    res.json({
      success: true,
      url: session.url,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const stripeWebhook = async (req, res) => {
  let event;

  try {
    const sig = req.headers["stripe-signature"];

    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    const userId = session.metadata.userId;
    const items = session.metadata.items.split(",").map((item) => {
      const [productId, quantity] = item.split(":");
      return { _id: productId, quantity: Number(quantity) };
    });
    const address = JSON.parse(session.metadata.address);

    // Prevent duplicate orders
    const existingOrder = await orderModel.findOne({
      "paymentResult.id": session.id,
    });

    if (existingOrder) {
      return res.json({ received: true });
    }

    await createOrderService({
      userId,
      orderItems: items.map((i) => ({
        product: i._id,
        quantity: i.quantity,
      })),
      shippingAddress: address,
      paymentMethod: "Stripe",
      paymentStatus: "paid",
      paymentResult: {
        id: session.id,
        status: session.payment_status,
        email: session.customer_details?.email,
      },
    });
  }

  res.json({ received: true });
};

export const verifyStripeSession = async (req, res) => {
  try {
    const { session_id } = req.body;

    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (session.payment_status !== "paid") {
      return res.status(400).json({
        success: false,
        message: "Payment not completed",
      });
    }

    const userId = session.metadata.userId;
    const items = session.metadata.items.split(",").map((item) => {
      const [productId, quantity] = item.split(":");
      return { _id: productId, quantity: Number(quantity) };
    });
    const address = JSON.parse(session.metadata.address);

    // Check if order already exists
    const existingOrder = await orderModel.findOne({
      "paymentResult.id": session.id,
    });

    if (existingOrder) {
      return res.json({
        success: true,
        message: "Order already exists",
      });
    }

    await createOrderService({
      userId,
      orderItems: items.map((i) => ({
        product: i._id,
        quantity: i.quantity,
      })),
      shippingAddress: address,
      paymentMethod: "Stripe",
      paymentStatus: "paid",
      paymentResult: {
        id: session.id,
        status: session.payment_status,
        email: session.customer_details?.email,
      },
    });

    res.json({
      success: true,
      message: "Order created successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
