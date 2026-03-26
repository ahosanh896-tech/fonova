import express from "express";
import userAuth from "../middleware/userAuth.js";
import { addToCart } from "../controller/cartController.js";

const cartRouter = express.Router();

cartRouter.post("/add", userAuth, addToCart);

export default cartRouter;
