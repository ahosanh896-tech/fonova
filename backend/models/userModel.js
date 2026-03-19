import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    email: { type: String, required: true, unique: true },

    password: { type: String, required: true, select: false },

    role: { type: String, enum: ["user", "admin"], default: "user" },

    cartData: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "product",
        },
        quantity: { type: Number, default: 1 },
        size: { type: String },
      },
    ],

    phone: { type: String },

    address: { type: Object },

    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  },
);

const userModel = mongoose.models.user || mongoose.model("user", userSchema);

export default userModel;
