import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    orderItems: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "product",
          required: true,
        },
        name: String,
        image: String,
        price: Number,
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        variant: {
          name: String,
          color: String,
        },
      },
    ],

    shippingAddress: {
      fullName: String,
      address: String,
      city: String,
      postalCode: String,
      country: String,
      phone: String,
    },

    paymentMethod: {
      type: String,
      enum: ["COD", "Stripe", "Paypal"],
      default: "pending",
    },

    itemsPrice: {
      type: Number,
      required: true,
      default: 0,
    },

    shippingPrice: {
      type: Number,
      defaut: 0,
    },

    totalPrice: {
      type: Number,
      required: true,
      default: 0,
    },

    orderStatus: {
      type: String,
      enum: ["processing", "shipped", "delivered", "cancelled"],
      default: "processing",
    },

    isDelivered: {
      type: Boolean,
      default: false,
    },

    PaymentResult: {
      id: String,
      status: String,
      update_time: String,
      email_address: String,
    },
  },
  {
    timestamps: true,
  },
);

const orderModel =
  mongoose.models.order || mongoose.model("order", orderSchema);

export default orderModel;
