import productModel from "../models/productModel.js";
import { cloudinary } from "../config/cloudinary.js";

export const addProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      shortDescription,
      price,
      discount,
      category,
      subCategory,
      brand,
      stock,
      bestseller,
      featured,
      newArrival,
      attributes,
      variants,
      compareFields,
      tags,
    } = req.body;

    //images(multer)
    const files = req.files || [];

    if (!files.length) {
      return res.status(400).json({
        success: false,
        message: "At least one image is requied",
      });
    }

    //upload to cloudinary
    const images = await Promise.all(
      files.map(async (file) => {
        const result = await cloudinary.uploader.upload(file.path, {
          resource_type: "image",
        });
        return {
          url: result.secure_url,
          public_id: result.public_id,
        };
      }),
    );

    const parsedVariants = variants ? JSON.parse(variants) : [];
    const parsedAttributes = attributes ? JSON.parse(attributes) : {};
    const parsedComparedFields = compareFields ? JSON.parse(compareFields) : {};
    const parsedTags = tags ? JSON.parse(tags) : [];

    const product = new productModel({
      name,
      description,
      shortDescription,
      price: Number(price),
      discount: Number(discount) || 0,
      category,
      subCategory,
      brand,
      stock: Number(stock) || 0,
      bestseller: bestseller === "true",
      featured: featured === "true",
      newArrival: newArrival === "true",
      images,
      attributes: parsedAttributes,
      variants: parsedVariants,
      compareFields: parsedComparedFields,
      tags: parsedTags,
      createBy: req.user?._id, // Admin auth not exists right now
    });

    await product.save();

    res.status(201).json({
      success: true,
      message: "Product added successfully",
      product,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getProducts = async (req, res) => {};

export const getSingleProduct = async (req, res) => {};

export const updateProduct = async (req, res) => {};

export const deleteProduct = async (req, res) => {};

export const compareProducts = async (req, res) => {};

export const getBestsellerProducts = async (req, res) => {};
