import { useEffect, useMemo, useState } from "react";
import { useOrder } from "../hooks/useOrder";
import Container from "../components/Container";
import Title from "../components/Title";

const Orders = () => {
  const { orders, getMyOrders, cancelOrder, loading } = useOrder();

  const [cancelingId, setCancelingId] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    getMyOrders();
  }, [getMyOrders]);

  // STATUS COLOR
  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
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

  // FILTER LOGIC
  const filteredOrders = useMemo(() => {
    if (filter === "active") {
      return orders.filter(
        (o) => o.orderStatus !== "cancelled" && o.orderStatus !== "delivered",
      );
    }
    if (filter === "cancelled") {
      return orders.filter((o) => o.orderStatus === "cancelled");
    }
    if (filter === "delivered") {
      return orders.filter((o) => o.orderStatus === "delivered");
    }
    return orders;
  }, [orders, filter]);

  //  CANCEL HANDLER (SAFE)
  const handleCancel = async (e, id) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      setCancelingId(id);
      await cancelOrder(id);
    } finally {
      setCancelingId(null);
    }
  };

  // CANCEL RULE
  const canCancel = (status) => {
    return ["pending", "processing"].includes(status);
  };

  if (loading) {
    return <p className="text-center mt-10">Loading orders...</p>;
  }

  return (
    <Container>
      <div className="border-t border-gray-200 pt-6 min-h-[80vh]">
        <div className="text-2xl mb-6">
          <Title text1="MY" text2="ORDERS" />
        </div>

        {/* 🔹 FILTER TABS */}
        <div className="flex gap-3 mb-6 flex-wrap">
          {["all", "active", "delivered", "cancelled"].map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`px-4 py-1 bg-gray-100 shadow-sm rounded text-sm ${
                filter === f ? "bg-gray-200 " : "hover:bg-gray-100"
              }`}
            >
              {f.toUpperCase()}
            </button>
          ))}
        </div>

        {/* 🔹 EMPTY */}
        {filteredOrders.length === 0 ? (
          <p className="text-gray-500">No orders found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredOrders.map((order) => (
              <div
                key={order._id}
                className="bg-gray-100 shadow-sm rounded p-5"
              >
                {/* HEADER */}
                <div className="flex flex-col sm:flex-row justify-between mb-4 gap-2">
                  <div>
                    <p className="text-sm text-gray-500">
                      Order ID: {order._id.slice(-8)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <span
                    className={`flex items-center w-25 justify-center px-3 py-1 text-xs rounded-full font-medium ${getStatusColor(
                      order.orderStatus,
                    )}`}
                  >
                    {order.orderStatus.toUpperCase()}
                  </span>
                </div>

                {/* ITEMS */}
                <div className="flex flex-col gap-3">
                  {order.orderItems.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 border-b border-gray-300 pb-3"
                    >
                      <img
                        src={item.image || "/placeholder.png"}
                        alt={item.name}
                        className="w-16 h-16 object-contain"
                      />

                      <div className="flex-1">
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-500">
                          Qty: {item.quantity}
                        </p>
                      </div>

                      <p className="font-semibold">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                {/* FOOTER */}
                <div className="flex justify-between items-center mt-4 gap-3">
                  <p className="font-semibold text-lg">
                    Total: ${order.totalPrice.toFixed(2)}
                  </p>

                  {/* CANCEL BUTTON */}
                  <div>
                    {canCancel(order.orderStatus) && (
                      <button
                        type="button"
                        onClick={(e) => handleCancel(e, order._id)}
                        disabled={cancelingId === order._id}
                        className="text-sm px-4 py-2 shadow rounded hover:bg-gray-200 active:300 disabled:opacity-50"
                      >
                        {cancelingId === order._id
                          ? "Cancelling..."
                          : "Cancel Order"}
                      </button>
                    )}

                    {/* STATUS MESSAGE */}
                    {order.orderStatus === "cancelled" && (
                      <p className="text-red-500 text-sm">Order Cancelled</p>
                    )}

                    {order.orderStatus === "delivered" && (
                      <p className="text-green-600 text-sm">
                        Delivered Successfully
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Container>
  );
};

export default Orders;
