import Notification from "../models/notificationModel.js";

export const sendNotification = async ({ userId, message }) => {
  if (!userId || !message) return;

  await Notification.create({
    user: userId,
    message,
  });
};
