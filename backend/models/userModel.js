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
          ref: "Product",
        },
        quantity: { type: Number, default: 1, min: 1 },
        size: { type: String },
      },
    ],

    //  Account control
    isActive: { type: Boolean, default: true },
    isAccountVerified: { type: Boolean, default: false },
    verifiedAt: { type: Date },

    // OTP (email verification)
    verifyOtp: { type: String, default: "" },
    verifyOtpExpireAt: { type: Date },

    //  Password reset
    resetOtp: { type: String, default: "" },
    resetOtpExpireAt: { type: Date },
  },
  {
    timestamps: true,
  },
);

const userModel = mongoose.models.User || mongoose.model("User", userSchema);

export default userModel;
