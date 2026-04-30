import express from "express";
import userAuth from "../middleware/userAuth.js";
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
  deleteAllNotifications,
} from "../controller/notificationController.js";

const notificationRouter = express.Router();

notificationRouter.use(userAuth);

notificationRouter.get("/", getNotifications);

notificationRouter.patch("/:id/read", markNotificationRead);
notificationRouter.patch("/read-all", markAllNotificationsRead);

notificationRouter.delete("/:id", deleteNotification);

notificationRouter.delete("/", deleteAllNotifications);

export default notificationRouter;
