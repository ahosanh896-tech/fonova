import { stripe } from "../config/stripe.js";
import productModel from "../models/productModel.js";

export const createStripeSession = async (req, res) => {
  try {
    const userId = req.user._id;
    const { items, address } = req.body;
    const { origin } = req.headers;

    const line_items = [];

    for (const item of items) {
      const product = await productModel.findById(item._id);

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

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items,

      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cancel`,

      metadata: {
        userId: userId.toString(),
        items: JSON.stringify(items),
        address: JSON.stringify(address),
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
