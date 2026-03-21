import mongoose from "mongoose";
import slugPlugin from "../utils/slugPlugin.js";
import stockMiddleware from "../utils/stockMiddleware.js";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    description: { type: String, required: true },

    shortDescription: { type: String, maxlength: 150 },

    price: { type: Number, required: true, min: 0 },

    discount: { type: Number, default: 0, min: 0, max: 100 },

    images: {
      type: [
        {
          url: { type: String, required: true },
          public_id: { type: String, required: true },
        },
      ],
      validate: [(val) => val.length > 0, "At least one image is required"],
    },

    category: {
      type: String,
      required: true,
    },

    subCategory: { type: String },

    brand: { type: String, default: "" },

    variants: {
      type: [
        {
          name: { type: String, required: true },
          price: { type: Number, min: 0 },
          stock: { type: Number, min: 0, default: 0 },
          color: String,
          image: {
            url: String,
            public_id: String,
          },
        },
      ],
      default: [],
    },

    attributes: {
      material: String,
      color: String,
      weight: Number,
      dimensions: {
        length: Number,
        width: Number,
        height: Number,
      },
    },

    stock: { type: Number, default: 0, min: 0 },

    sold: { type: Number, default: 0 },

    bestseller: { type: Boolean, default: false },

    featured: {
      type: Boolean,
      default: false,
    },

    newArrival: { type: Boolean, default: false },

    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
      set: (v) => Math.round(v * 10) / 10,
    },

    numReviews: { type: Number, default: 0 },

    compareFields: { warranty: String, origin: String, finish: String },

    isActive: { type: Boolean, default: true },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

productSchema.plugin(slugPlugin, { field: "name" });
productSchema.plugin(stockMiddleware);

productSchema.virtual("finalPrice").get(function () {
  return Math.max(0, this.price - (this.price * this.discount) / 100);
});

productSchema.index({ slug: 1 }, { unique: true });
productSchema.index({
  name: "text",
  description: "text",
  category: "text",
});
productSchema.index({ price: 1 });
productSchema.index({ category: 1 });
productSchema.index({ category: 1, price: 1 });

const productModel =
  mongoose.models.product || mongoose.model("product", productSchema);

export default productModel;
