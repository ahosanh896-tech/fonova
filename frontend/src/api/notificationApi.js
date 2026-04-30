import { api } from "./api";

export const getNotificationsApi = async () => {
  const res = await api.get("/api/notification");
  return res.data;
};

export const markNotificationReadApi = async (notificationId) => {
  const res = await api.patch(`/api/notification/${notificationId}/read`);
  return res.data;
};

export const markAllNotificationsReadApi = async () => {
  const res = await api.patch("/api/notification/read-all");
  return res.data;
};

export const deleteNotificationApi = async (id) => {
  const res = await api.delete(`/api/notification/${id}`);
  return res.data;
};

export const deleteAllNotificationsApi = async () => {
  const res = await api.delete(`/api/notification`);
  return res.data;
};
