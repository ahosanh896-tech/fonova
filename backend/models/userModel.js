import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"],
    },

    password: { type: String, required: true, select: false },

    role: { type: String, enum: ["user", "admin"], default: "user" },

    // Cart
    cartData: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "product",
        },
        quantity: { type: Number, default: 1, min: 1 },
        size: { type: String, default: "" },
      },
    ],

    // Account control
    isActive: { type: Boolean, default: true },
    isAccountVerified: { type: Boolean, default: false },
    verifiedAt: { type: Date },

    // OTP (email verification)
    verifyOtp: { type: String, default: null, select: false },
    verifyOtpExpireAt: { type: Date, default: null },

    // Password reset
    resetOtp: { type: String, default: null, select: false },
    resetOtpExpireAt: { type: Date, default: null },
  },
  { timestamps: true },
);

const userModel = mongoose.models.User || mongoose.model("User", userSchema);

export default userModel;
