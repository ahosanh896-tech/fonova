import express from "express";
import userAuth from "../middleware/userAuth.js";
import {
  addToCart,
  getUserCart,
  updateCart,
} from "../controller/cartController.js";

const cartRouter = express.Router();

cartRouter.post("/", userAuth, getUserCart);
cartRouter.post("/add", userAuth, addToCart);
cartRouter.put("/update", userAuth, updateCart);

export default cartRouter;
