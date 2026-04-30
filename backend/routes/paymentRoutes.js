// routes/paymentRoutes.js
import express from "express";
import userAuth from "../middleware/userAuth.js";
import {
  createStripeSession,
  stripeWebhook,
  verifyStripeSession,
} from "../controller/paymentController.js";

const paymentRouter = express.Router();

paymentRouter.post("/stripe/create-session", userAuth, createStripeSession);

paymentRouter.post(
  "/stripe/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhook,
);

paymentRouter.post("/stripe/verify-session", userAuth, verifyStripeSession);

export default paymentRouter;
