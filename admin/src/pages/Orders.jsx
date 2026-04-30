import { useEffect, useState } from "react";
import Api from "../api/api";
import { successToast, errorToast } from "../toast";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await Api.get("/api/order/admin/all");
      if (res.data.success) setOrders(res.data.orders);
    } catch {
      errorToast("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      const res = await Api.put(`/api/order/status/${id}`, { status });
      if (res.data.success) {
        successToast("Updated");
        fetchOrders();
      }
    } catch {
      errorToast("Error");
    }
  };

  const markDelivered = async (id) => {
    try {
      const res = await Api.put(`/api/order/deliver/${id}`);
      if (res.data.success) {
        successToast("Delivered");
        fetchOrders();
      }
    } catch {
      errorToast("Error");
    }
  };

  const deleteOrder = async (id) => {
    try {
      const res = await Api.delete(`/api/order/${id}`);
      if (res.data.success) {
        successToast("Deleted");
        fetchOrders();
      }
    } catch {
      errorToast("Error");
    }
  };

  const statusStyle = (status) => {
    switch (status) {
      case "processing":
        return "bg-yellow-100 text-yellow-700";
      case "shipped":
        return "bg-blue-100 text-blue-700";
      case "delivered":
        return "bg-green-100 text-green-700";
      case "cancelled":
        return "bg-red-100 text-red-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl md:text-2xl font-semibold mb-4">
        Orders Management
      </h2>

      {/* ✅ DESKTOP TABLE */}
      <div className="hidden lg:block bg-white shadow rounded-lg overflow-hidden">
        <div className="grid grid-cols-6 bg-gray-100 px-4 py-3 text-sm font-semibold">
          <span>Customer</span>
          <span>Items</span>
          <span>Total</span>
          <span>Status</span>
          <span>Date</span>
          <span>Actions</span>
        </div>

        {orders.map((order) => (
          <div
            key={order._id}
            className="grid grid-cols-6 px-4 py-4 border-t items-center hover:bg-gray-50"
          >
            <div>
              <p className="font-medium">{order.user?.name}</p>
              <p className="text-xs text-gray-500">{order.user?.email}</p>
            </div>

            <div className="flex flex-col gap-1">
              {order.orderItems.slice(0, 2).map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <img src={item.image} className="w-8 h-8" />
                  <span>{item.name}</span>
                </div>
              ))}
            </div>

            <p className="font-semibold">${order.totalPrice}</p>

            <span
              className={` px-2 py-1 text-xs rounded-full w-fit ${statusStyle(
                order.orderStatus,
              )}`}
            >
              {order.orderStatus}
            </span>

            <p className="text-sm text-gray-500">
              {new Date(order.createdAt).toLocaleDateString()}
            </p>

            <div className="flex flex-col gap-2">
              <select
                value={order.orderStatus}
                onChange={(e) => updateStatus(order._id, e.target.value)}
                className="border text-xs px-2 py-1 rounded"
              >
                <option>processing</option>
                <option>shipped</option>
                <option>delivered</option>
                <option>cancelled</option>
              </select>

              <div className="flex gap-2">
                <button
                  onClick={() => markDelivered(order._id)}
                  className="bg-green-500 text-white px-2 py-1 text-xs rounded"
                >
                  Deliver
                </button>
                <button
                  onClick={() => deleteOrder(order._id)}
                  className="bg-red-500 text-white px-2 py-1 text-xs rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ✅ MOBILE / TABLET CARD VIEW */}
      <div className="lg:hidden flex flex-col gap-4">
        {orders.map((order) => (
          <div
            key={order._id}
            className="bg-white p-4 rounded-lg shadow border"
          >
            {/* HEADER */}
            <div className="flex justify-between mb-2">
              <div>
                <p className="font-medium">{order.user?.name}</p>
                <p className="text-xs text-gray-500">{order.user?.email}</p>
              </div>

              <span
                className={`px-2 py-1 text-xs rounded-full ${statusStyle(
                  order.orderStatus,
                )}`}
              >
                {order.orderStatus}
              </span>
            </div>

            {/* ITEMS */}
            <div className="flex flex-col gap-2 mt-2">
              {order.orderItems.map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <img src={item.image} className="w-10 h-10" />
                  <div className="flex-1 text-sm">
                    {item.name} × {item.quantity}
                  </div>
                </div>
              ))}
            </div>

            {/* FOOTER */}
            <div className="flex justify-between items-center mt-3">
              <p className="font-semibold">${order.totalPrice.toFixed(2)}</p>

              <select
                value={order.orderStatus}
                onChange={(e) => updateStatus(order._id, e.target.value)}
                className="border border-gray-300 text-sm px-2 py-1 rounded"
              >
                <option>processing</option>
                <option>shipped</option>
                <option>delivered</option>
                <option>cancelled</option>
              </select>
            </div>

            {/* ACTIONS */}
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => markDelivered(order._id)}
                className=" w-30 bg-green-500 text-white py-1 rounded text-sm"
              >
                Deliver
              </button>
              <button
                onClick={() => deleteOrder(order._id)}
                className="w-30 bg-red-500 text-white py-1 rounded text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
