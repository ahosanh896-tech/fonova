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

export const getProducts = async (req, res) => {
  try {
    const {
      keyword,
      category,
      minPrice,
      maxPrice,
      sort,
      page = 1,
      limit = 10,
    } = req.query;

    let query = {};

    if (keyword) {
      query.$text = { $search: keyword };
    }

    if (category) {
      query.category = category;
    }

    //price filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    //Only active products
    query.isActive = true;

    //sorting
    let sortOption = {};
    if (sort === "price_asc") sortOption.price = 1;
    if (sort === "price_desc") sortOption.price = -1;
    if (sort === "newest") sortOption.createAt = -1;

    //pagination
    const skip = (Number(page) - 1) * Number(limit);

    const products = await productModel
      .find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit));

    const total = await productModel.countDocuments(query);

    res.json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      products,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getSingleProduct = async (req, res) => {};

export const updateProduct = async (req, res) => {};

export const deleteProduct = async (req, res) => {};

export const compareProducts = async (req, res) => {};

export const getBestsellerProducts = async (req, res) => {};
