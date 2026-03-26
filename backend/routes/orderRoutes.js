import express from "express";
import userAuth from "../middleware/userAuth.js";
import { placeOrder } from "../controller/orderController.js";

const orderRouter = express.Router();

orderRouter.post("/place", userAuth, placeOrder);

export default orderRouter;
