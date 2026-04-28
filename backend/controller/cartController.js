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

    const newQuantity = existingItem
      ? existingItem.quantity + quantity
      : quantity;

    //Stock check
    if (newQuantity > product.stock) {
      return res.status(400).json({
        success: false,
        message: `Only ${product.stock} items available in stock.`,
      });
    }

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

    res.status(200).json({
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

export const updateCart = async (req, res) => {
  try {
    const { productId, quantity, size = "" } = req.body;

    // VALIDATION
    if (!productId || quantity === undefined) {
      return res.status(400).json({
        success: false,
        message: "Product ID and quantity are required",
      });
    }

    // FIND PRODUCT
    const product = await productModel.findById(productId);

    if (!product || !product.isActive) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // FIND USER
    const user = await userModel.findById(req.user._id);

    const item = user.cartData.find(
      (i) => i.productId.toString() === productId && (i.size || "") === size,
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found in cart",
      });
    }

    // REMOVE ITEM IF QUANTITY <= 0
    if (quantity <= 0) {
      user.cartData = user.cartData.filter(
        (i) =>
          !(i.productId.toString() === productId && (i.size || "") === size),
      );

      await user.save();

      return res.status(200).json({
        success: true,
        message: "Item removed from cart",
        cart: user.cartData,
      });
    }

    //  STOCK VALIDATION
    if (quantity > product.stock) {
      return res.status(400).json({
        success: false,
        message: `Only ${product.stock} items available in stock`,
      });
    }

    // UPDATE QUANTITY
    item.quantity = quantity;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Cart updated successfully",
      cart: user.cartData,
    });
  } catch (error) {
    console.error("UPDATE CART ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getUserCart = async (req, res) => {
  try {
    const user = await userModel
      .findById(req.user._id)
      .populate("cartData.productId");

    res.status(200).json({
      success: true,
      cart: user.cartData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const { productId, size = "" } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    const user = await userModel.findById(req.user._id);

    user.cartData = user.cartData.filter(
      (item) =>
        !(item.productId.toString() === productId && item.size === size),
    );

    await user.save();

    res.json({
      success: true,
      message: "Item removed from cart",
      cart: user.cartData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const clearCart = async (req, res) => {
  try {
    const user = await userModel.findById(req.user._id);

    user.cartData = [];

    await user.save();

    res.json({
      success: true,
      message: "Cart cleared successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
