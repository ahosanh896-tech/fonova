import express, { Router } from "express";
import userAuth from "../middleware/userAuth.js";
import {
  getSingleOrder,
  getUserOrders,
  placeOrder,
} from "../controller/orderController.js";

const orderRouter = express.Router();

orderRouter.post("/place", userAuth, placeOrder);

orderRouter.get("/my-orders", userAuth, getUserOrders);

orderRouter.get("/:id", userAuth, getSingleOrder);

export default orderRouter;
