import userModel from "../models/userModel.js";
import productModel from "../models/productModel.js";

export const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1, size = "" } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    const product = await productModel.findById(productId);

    if (!product || !product.isActive) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const user = await userModel.findById(req.user._id);

    // check if item exists
    const existingItem = user.cartData.find(
      (item) => item.productId.toString() === productId && item.size === size,
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      user.cartData.push({
        productId,
        quantity,
        size,
      });
    }

    await user.save();

    res.json({
      success: true,
      message: "Product added to cart",
      cart: user.cartData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const updateCart = async (req, res) => {};
export const getUserCart = async (req, res) => {};
export const removeFromCart = async (req, res) => {};

export const clearCart = async (req, res) => {};
