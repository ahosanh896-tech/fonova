import express from "express";
import userAuth from "../middleware/userAuth.js";
import { getUserOrders, placeOrder } from "../controller/orderController.js";

const orderRouter = express.Router();

orderRouter.post("/place", userAuth, placeOrder);

orderRouter.get("/my-orders", userAuth, getUserOrders);

export default orderRouter;
