import express from "express";
import userAuth from "../middleware/userAuth.js";
import isAdmin from "../middleware/isAdmin.js";
import {
  cancelOrder,
  deleteOrder,
  getSingleOrder,
  getUserOrders,
  markAsDelivered,
  placeOrder,
  updateOrderStatus,
  updatePaymentStatus,
} from "../controller/orderController.js";

const orderRouter = express.Router();

orderRouter.post("/place", userAuth, placeOrder);

orderRouter.get("/my-orders", userAuth, getUserOrders);
orderRouter.put("/cancel/:id", userAuth, cancelOrder);

orderRouter.put("/status/:id", userAuth, isAdmin, updateOrderStatus);
orderRouter.put("/payment/:id", userAuth, isAdmin, updatePaymentStatus);
orderRouter.put("/deliver/:id", userAuth, isAdmin, markAsDelivered);
orderRouter.delete("/:id", userAuth, isAdmin, deleteOrder);

orderRouter.get("/:id", userAuth, getSingleOrder);

export default orderRouter;
