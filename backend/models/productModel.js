import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true },

    description: { type: String, required: true },

    price: { type: Number, required: true },
    discount: { type: Number, default: 0 },

    imgage: [
      {
        url: String,
        public_id: String,
      },
    ],

    category: { type: String, required: true },
    subCategory: { type: String, required: true },

    brand: { type: String },

    sizes: { type: Array, required: true },

    stock: { type: Number, default: 0 },

    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },

    bestseller: { type: Boolean, default: false },

    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  },
);

export default productSchema;
