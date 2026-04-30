import React from "react";
import { useNotification } from "../hooks/useNotification";

const NotificationsPage = () => {
  const {
    notifications = [],
    markNotificationRead,
    markAllRead,
    deleteNotification,
  } = useNotification();

  const hasNotifications = notifications.length > 0;
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-lg font-semibold">Notifications</h1>
            <p className="text-xs text-slate-500">
              {unreadCount > 0
                ? `${unreadCount} unread`
                : "No unread notifications"}
            </p>
          </div>

          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="text-xs px-3 py-1 border rounded border-gray-200 bg-white hover:bg-gray-100"
            >
              Mark all read
            </button>
          )}
        </div>

        {/* Body */}
        {!hasNotifications ? (
          <div className="text-center mt-20">
            <p className="text-sm font-semibold">Nothing here yet</p>
            <p className="text-xs text-slate-500 mt-2">
              Notifications will appear here
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((item) => (
              <div
                key={item._id}
                className={`relative px-4 py-3 border rounded ${
                  item.isRead ? "bg-slate-100" : "bg-white"
                }`}
              >
                {/* Click area */}
                <button
                  onClick={() => markNotificationRead(item._id)}
                  className="w-full text-left"
                >
                  <p className="text-sm font-semibold">
                    {item.message || "Order confirmed"}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    {new Date(item.createdAt).toLocaleString()}
                  </p>
                </button>

                {/* NEW badge */}
                {!item.isRead && (
                  <span className="absolute top-3 right-10 text-[10px] font-semibold text-emerald-600">
                    New
                  </span>
                )}

                {/* Delete button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteNotification(item._id);
                  }}
                  className="absolute top-2 right-2 text-xs text-red-500 hover:text-red-700"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
