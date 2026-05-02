import { useCallback, useState } from "react";
import {
  getNotificationsApi,
  markNotificationReadApi,
  markAllNotificationsReadApi,
  deleteNotificationApi,
  deleteAllNotificationsApi,
} from "../api/notificationApi";
import { errorToast, successToast } from "../Toast";

export const useNotification = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleError = useCallback((error) => {
    const errData = error.response?.data;
    errorToast(errData?.message || error.message);
    return errData;
  }, []);

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getNotificationsApi();

      if (data.success) {
        setNotifications(data.notifications || []);
      }

      return data;
    } catch (error) {
      return handleError(error);
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  const markNotificationRead = useCallback(
    async (notificationId) => {
      let prevNotifications;

      setNotifications((current) => {
        prevNotifications = current;
        return current.map((item) =>
          item._id === notificationId ? { ...item, isRead: true } : item,
        );
      });

      try {
        const data = await markNotificationReadApi(notificationId);

        if (!data.success) {
          setNotifications(prevNotifications);
          errorToast(data.message);
        }

        return data;
      } catch (error) {
        setNotifications(prevNotifications);
        return handleError(error);
      }
    },
    [handleError],
  );

  const markAllRead = useCallback(async () => {
    const prevNotifications = [...notifications];

    setNotifications((current) =>
      current.map((item) => ({ ...item, isRead: true })),
    );

    try {
      const data = await markAllNotificationsReadApi();

      if (data.success) {
        successToast("All notifications marked as read");
      } else {
        setNotifications(prevNotifications);
        errorToast(data.message);
      }

      return data;
    } catch (error) {
      setNotifications(prevNotifications);
      return handleError(error);
    }
  }, [notifications, handleError]);

  const deleteNotification = useCallback(
    async (notificationId) => {
      const prevNotifications = notifications;

      setNotifications((current) =>
        current.filter((item) => item._id !== notificationId),
      );

      try {
        const data = await deleteNotificationApi(notificationId);

        if (data.success) {
          successToast("Notification deleted");
        } else {
          setNotifications(prevNotifications);
          errorToast(data.message);
        }

        return data;
      } catch (error) {
        setNotifications(prevNotifications);
        return handleError(error);
      }
    },
    [notifications, handleError],
  );

  const deleteAllNotifications = useCallback(async () => {
    const prevNotifications = notifications;

    setNotifications([]);

    try {
      const data = await deleteAllNotificationsApi();

      if (data.success) {
        successToast("All notifications cleared");
      } else {
        setNotifications(prevNotifications);
        errorToast(data.message);
      }

      return data;
    } catch (error) {
      setNotifications(prevNotifications);
      return handleError(error);
    }
  }, [notifications, handleError]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return {
    unreadCount,
    notifications,
    loading,
    fetchNotifications,
    markNotificationRead,
    markAllRead,
    deleteNotification,
    deleteAllNotifications,
  };
};
