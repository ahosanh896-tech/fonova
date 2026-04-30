import React, { useEffect } from "react";

const Notification = ({
  notificationsOpen,
  setNotificationsOpen,
  notifications = [],
  unreadCount = 0,
  markNotificationRead,
  markAllRead,
  deleteNotification,
  deleteAllNotifications, // ✅ NEW PROP
}) => {
  const hasNotifications = notifications.length > 0;

  // Close on ESC
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setNotificationsOpen(false);
      }
    };

    if (notificationsOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [notificationsOpen, setNotificationsOpen]);

  if (!notificationsOpen) return null;

  return (
    <>
      {/* overlay */}
      <div
        onClick={() => setNotificationsOpen(false)}
        className="fixed inset-0 z-40 bg-transparent"
      />

      {/* dropdown */}
      <div className="absolute right-4 top-15 z-50 w-70 sm:w-90 border rounded border-gray-200 overflow-hidden bg-white shadow-sm">
        {/* header */}
        <div className="border-b border-slate-200 px-5 py-2">
          <div className="flex items-center justify-between">
            {/* left */}
            <div>
              <p className="text-sm font-semibold">Notifications</p>
              <p className="text-xs text-slate-500">
                {unreadCount > 0
                  ? `${unreadCount} unread`
                  : "No unread notifications"}
              </p>
            </div>

            {/* right actions */}
            <div className="flex items-center gap-2">
              {/* mark all */}
              {unreadCount > 0 && (
                <button
                  onClick={() => {
                    markAllRead();
                    setNotificationsOpen(false);
                  }}
                  className="text-xs px-2 py-1 border rounded border-gray-200 hover:bg-gray-100"
                >
                  Mark all
                </button>
              )}

              {/* delete all */}
              {hasNotifications && (
                <button
                  onClick={() => {
                    deleteAllNotifications();
                    setNotificationsOpen(false);
                  }}
                  className="text-xs px-2 py-1 border rounded border-red-200 text-red-500 hover:bg-red-50"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>

        {/* body */}
        <div className="max-h-80 overflow-y-auto bg-slate-50 px-3 py-3">
          {!hasNotifications ? (
            <p className="text-center text-sm text-gray-500">
              Nothing here yet
            </p>
          ) : (
            <div className="space-y-2">
              {notifications.map((item) => (
                <div
                  key={item._id}
                  className={`relative px-4 py-2 transition ${
                    item.isRead ? "bg-slate-100" : "bg-white"
                  } hover:bg-gray-50`}
                >
                  {/* click area */}
                  <button
                    onClick={() => {
                      markNotificationRead(item._id);
                      setNotificationsOpen(false);
                    }}
                    className="w-full text-left"
                  >
                    <p className="text-sm font-semibold text-gray-800">
                      {item.message || "Order confirmed"}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(item.createdAt).toLocaleString()}
                    </p>
                  </button>

                  {/* delete single */}
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
    </>
  );
};

export default Notification;
