import express from "express";
import userAuth from "../middleware/userAuth.js";
import {
  addToCart,
  clearCart,
  getUserCart,
  removeFromCart,
  updateCart,
} from "../controller/cartController.js";

const cartRouter = express.Router();

cartRouter.get("/", userAuth, getUserCart);
cartRouter.post("/add", userAuth, addToCart);
cartRouter.put("/update", userAuth, updateCart);

cartRouter.delete("/remove", userAuth, removeFromCart);
cartRouter.delete("/clear", userAuth, clearCart);

export default cartRouter;
