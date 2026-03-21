import mongoose from "mongoose";
import slugPlugin from "../utils/slugPlugin.js";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },

    slug: {
      type: String,
      unique: true,
      lowercase: true,
      required: true,
      index: true,
    },

    description: { type: String, required: true },

    shortDescription: { type: String, maxlength: 150 },

    price: { type: Number, required: true, min: 0 },

    discount: { type: Number, default: 0, min: 0, max: 100 },

    images: [
      {
        url: {
          type: String,
          required: true,
        },
        public_id: {
          type: String,
          required: true,
        },
      },
    ],

    category: { type: String, required: true },

    subCategory: { type: String },

    brand: { type: String, default: "" },

    variants: [
      {
        name: String, // e.g. "Large", "Medium"
        price: { type: Number, min: 0 },
        stock: { type: Number, min: 0 },
        color: String,

        image: { url: String, public_id: String },
      },
    ],

    attributes: {
      material: String,
      color: String,
      weight: Number,

      dimensions: { length: Number, width: Number, height: Number },
    },

    stock: { type: Number, default: 0, min: 0 },

    sold: { type: Number, default: 0 },

    bestseller: { type: Boolean, default: false },

    featured: { type: Boolean, default: false },

    newArrival: { type: Boolean, default: false },

    rating: { type: Number, default: 0, min: 0, max: 5 },

    numReviews: { type: Number, default: 0 },

    compareFields: { warranty: String, origin: String, finish: String },

    isActive: { type: Boolean, default: true },

    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Slug plugin
productSchema.plugin(slugPlugin, { field: "name" });

// Virtual: Final Price
productSchema.virtual("finalPrice").get(function () {
  return Math.max(0, this.price - (this.price * this.discount) / 100);
});

// Indexes (for performance)
productSchema.index({
  name: "text",
  description: "text",
  category: "text",
});

productSchema.index({ price: 1 });
productSchema.index({ category: 1 });
productSchema.index({ slug: 1 });

//  Middleware (optional but powerful)
// Auto-set stock from variants if exists
productSchema.pre("save", function (next) {
  if (this.variants && this.variants.length > 0) {
    this.stock = this.variants.reduce(
      (total, variant) => total + (variant.stock || 0),
      0,
    );
  }
  next();
});

const productModel =
  mongoose.models.product || mongoose.model("product", productSchema);

export default productModel;
