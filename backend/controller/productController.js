import productModel from "../models/productModel.js";
import orderModel from "../models/orderModel.js";
import { cloudinary } from "../config/cloudinary.js";
import calculateRating from "../utils/calculateRating.js";
import redisClient from "../config/redis.js";
import { clearProductCache } from "../utils/cacheHelper.js";

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
      req.files.map(
        (file) =>
          new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
              { folder: "products" },
              (error, result) => {
                if (error) return reject(error);

                resolve({
                  url: result.secure_url,
                  public_id: result.public_id,
                });
              },
            );

            stream.end(file.buffer);
          }),
      ),
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
      createdBy: req.user?._id, // Admin auth not exists right now
    });

    await product.save();

    await clearProductCache(); // no slug → clears list cache

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
      subCategory,
      minPrice,
      maxPrice,
      sort,
      page = 1,
      limit = 10,
    } = req.query;

    //Redis key
    const PREFIX = "fornova";
    const cacheKey = `${PREFIX}:products:${JSON.stringify(req.query)}`;

    //Check cache first
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      return res.json(JSON.parse(cachedData));
    }

    let query = {};

    if (keyword) {
      query.$text = { $search: keyword };
    }

    if (category) {
      query.category = {
        $regex: category,
        $options: "i",
      };
    }

    if (subCategory) {
      query.subCategory = {
        $regex: subCategory,
        $options: "i",
      };
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
    if (sort === "newest") sortOption.createdAt = -1;

    //pagination
    const skip = (Number(page) - 1) * Number(limit);

    const products = await productModel
      .find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit));

    const total = await productModel.countDocuments(query);

    const response = {
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      products,
    };

    // Store in Redis for (60 seconds)
    await redisClient.setEx(cacheKey, 60, JSON.stringify(response));

    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getSingleProduct = async (req, res) => {
  try {
    const { slug } = req.params;

    //  Fetch by slug
    const product = await productModel
      .findOne({ slug, isActive: true })
      .populate("createdBy", "name")
      .lean();

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Related products(same category)
    const relatedProducts = await productModel
      .find({
        category: product.category,
        _id: { $ne: product._id },
        isActive: true,
      })
      .select("name slug price images rating")
      .limit(4)
      .lean();

    //limit reviews
    const reviews = product.reviews ? product.reviews.slice(-5).reverse() : [];

    const response = {
      success: true,
      product: { ...product, reviews },
      relatedProducts,
    };

    return res.json(response);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await productModel.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

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
      removeImages,
    } = req.body;

    // Delete selected images
    let parsedRemoved = [];

    if (removeImages) {
      try {
        parsedRemoved = JSON.parse(removeImages);

        //ensure always array
        if (!Array.isArray(parsedRemoved)) {
          parsedRemoved = [parsedRemoved];
        }

        //delete from cloudinary
        await Promise.all(
          parsedRemoved.map((public_id) =>
            cloudinary.uploader.destroy(public_id),
          ),
        );

        //remove from mongodb
        product.images = product.images.filter(
          (img) => !parsedRemoved.includes(img.public_id),
        );
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: "Invalid removedImages format",
        });
      }
    }

    //Add new images
    const newImages = await Promise.all(
      req.files.map(
        (file) =>
          new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
              { folder: "products" },
              (error, result) => {
                if (error) return reject(error);

                resolve({
                  url: result.secure_url,
                  public_id: result.public_id,
                });
              },
            );

            stream.end(file.buffer);
          }),
      ),
    );

    //safe json parsing
    const safeParse = (data, fallback) => {
      try {
        return data ? JSON.parse(data) : fallback;
      } catch (error) {
        console.log(error);
        return fallback;
      }
    };

    product.variants = safeParse(variants, product.variants);
    product.attributes = safeParse(attributes, product.attributes);
    product.compareFields = safeParse(compareFields, product.compareFields);
    product.tags = safeParse(tags, product.tags);

    //update fields
    if (name) product.name = name;
    if (description) product.description = description;
    if (shortDescription) product.shortDescription = shortDescription;

    if (price !== undefined) product.price = Number(price);
    if (discount !== undefined) product.discount = Number(discount);

    if (category) product.category = category;
    if (subCategory) product.subCategory = subCategory;
    if (brand) product.brand = brand;

    if (stock !== undefined) product.stock = Number(stock);

    //auto hide logic
    if (product.stock === 0) {
      product.isActive = false;
    } else {
      product.isActive = true;
    }

    if (bestseller !== undefined) product.bestseller = bestseller === "true";

    if (featured !== undefined) product.featured = featured === "true";

    if (newArrival !== undefined) product.newArrival = newArrival === "true";

    await product.save();

    await clearProductCache(product.slug);

    res.json({
      success: true,
      message: "Product updated successfully",
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

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { soft } = req.query; //if ?soft=true

    const product = await productModel.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    //soft delete
    if (soft === "true") {
      product.isActive = false;
      await product.save();

      await clearProductCache(product.slug); // ✅ ADD THIS

      return res.json({
        success: true,
        message: "Product soft deleted (hidden)",
      });
    }

    //hard delete
    if (product.images && product.images.length > 0) {
      await Promise.all(
        product.images.map(async (img) => {
          if (img.public_id) {
            try {
              await cloudinary.uploader.destroy(img.public_id);
            } catch (error) {
              console.error("Cloudinary delete error:", error.message);
            }
          }
        }),
      );
    }

    await product.deleteOne();

    await clearProductCache(product.slug);

    res.json({
      success: true,
      message: "Product permanently deleted",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const restoreProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await productModel.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    product.isActive = true;
    await product.save();

    await clearProductCache(product.slug);

    res.json({
      success: true,
      message: "Product restored successfully",
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

export const compareProducts = async (req, res) => {
  try {
    const { ids } = req.query;

    if (!ids) {
      return res.status(404).json({
        success: false,
        message: "Product IDs or slugs are required",
      });
    }

    //convert ids string to array
    const productIds = ids.split(",").map((item) => item.trim());

    //limit max compare
    if (productIds.length > 4) {
      return res.status(400).json({
        success: false,
        message: "You can compare up to 4 products only",
      });
    }

    const products = await productModel
      .find({
        $or: [{ _id: { $in: productIds } }, { slug: { $in: productIds } }],
        isActive: true,
      })
      .select(
        "name slug price discount images rating numReviews category brand compareFields attributes ",
      )
      .lean();

    if (!products.length) {
      return res.status(404).json({
        success: false,
        message: "No products found",
      });
    }

    const formattedProducts = products.map((p) => ({
      _id: p._id,
      name: p.name,
      slug: p.slug,
      price: p.price,
      discount: p.discount,
      finalPrice: p.price - (p.price * (p.discount || 0)) / 100,
      image: p.images?.[0]?.url || "",
      rating: p.rating,
      numReviews: p.numReviews,
      category: p.category,
      brand: p.brand,
      compare: p.compareFields,
      attributes: p.attributes,
    }));

    res.json({
      success: true,
      count: formattedProducts.length,
      products: formattedProducts,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getBestsellerProducts = async (req, res) => {
  try {
    const { limit = 8, sort = "latest", category } = req.query;

    let query = {
      bestseller: true,
      isActive: true,
    };

    if (category) {
      query.category = category;
    }

    let sortOption = {};

    switch (sort) {
      case "price_asc":
        sortOption.price = 1;
        break;
      case "price_desc":
        sortOption.price = -1;
        break;
      case "top_selling":
        sortOption.sold = -1;
        break;
      default:
        sortOption.createAt = -1;
    }

    const products = await productModel
      .find(query)
      .sort(sortOption)
      .limit(Number(limit))
      .lean({ virtuals: true });

    res.json({
      success: true,
      count: products.length,
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

export const addReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;

    const product = await productModel.findById(id);

    if (!product || !product.isActive) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const userId = req.user._id;

    // rating validation
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5",
      });
    }

    // // purchase check
    // const hasPurchased = await orderModel.findOne({
    //   user: userId,
    //   "orderItems.product": id,
    //   isPaid: true,
    // });

    // if (!hasPurchased) {
    //   return res.status(403).json({
    //     success: false,
    //     message: "Purchase required to review.",
    //   });
    // }

    // duplicate check
    const existingReview = product.reviews.find(
      (r) => r.user.toString() === userId.toString(),
    );

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message:
          "You already reviewed this product. Please update your review.",
      });
    }

    // add review
    product.reviews.push({
      user: userId,
      name: req.user.name,
      rating: Number(rating),
      comment: comment?.trim(),
    });

    // update rating
    calculateRating(product);

    await product.save();

    // clear cache
    await clearProductCache(product.slug);

    res.status(200).json({
      success: true,
      message: "Review added successfully",
      rating: product.rating,
      numReviews: product.numReviews,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;

    if (!rating) {
      return res.status(400).json({
        success: false,
        message: "Rating is required",
      });
    }

    const product = await productModel.findById(id);

    if (!product || !product.isActive) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const review = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString(),
    );

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found. Please add a review frist.",
      });
    }

    //update review
    review.rating = Number(rating);
    review.comment = comment || review.comment;

    calculateRating(product);

    await product.save();

    await clearProductCache(product.slug);

    res.json({
      success: true,
      message: "Review update successfully",
      rating: product.rating,
      numReviews: product.numReviews,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await productModel.findById(id);

    if (!product || !product.isActive) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (!product.reviews || product.reviews.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No reviews found",
      });
    }

    const review = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString(),
    );

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    product.reviews = product.reviews.filter(
      (r) => r.user.toString() !== req.user._id.toString(),
    );

    calculateRating(product);

    await product.save();

    await clearProductCache(product.slug);

    res.json({
      success: true,
      message: "Review deleted successfully",
      rating: product.rating,
      numReviews: product.numReviews,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
