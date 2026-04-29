// hooks/useOrder.js
import { useState, useCallback } from "react";
import { api } from "../api/api";
import { errorToast, successToast } from "../Toast";

export const useOrder = () => {
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [singleOrder, setSingleOrder] = useState(null);

  // PLACE COD ORDER
  const placeOrder = useCallback(async (payload) => {
    try {
      setLoading(true);

      const res = await api.post("/orders/place", payload);

      if (res.data.success) {
        successToast(res.data.message);
      } else {
        errorToast(res.data.message);
      }

      return res.data;
    } catch (error) {
      const errData = error.response?.data;
      errorToast(errData?.message || error.message);
      return errData;
    } finally {
      setLoading(false);
    }
  }, []);

  // GET USER ORDERS
  const getMyOrders = useCallback(async () => {
    try {
      setLoading(true);

      const res = await api.get("/orders/my-orders");

      if (res.data.success) {
        setOrders(res.data.orders);
      } else {
        errorToast(res.data.message);
      }

      return res.data;
    } catch (error) {
      const errData = error.response?.data;
      errorToast(errData?.message || error.message);
      return errData;
    } finally {
      setLoading(false);
    }
  }, []);

  // GET SINGLE ORDER
  const getOrderById = useCallback(async (id) => {
    try {
      setLoading(true);

      const res = await api.get(`/orders/${id}`);

      if (res.data.success) {
        setSingleOrder(res.data.order);
      } else {
        errorToast(res.data.message);
      }

      return res.data;
    } catch (error) {
      const errData = error.response?.data;
      errorToast(errData?.message || error.message);
      return errData;
    } finally {
      setLoading(false);
    }
  }, []);

  // CANCEL ORDER
  const cancelOrder = useCallback(async (id) => {
    try {
      setLoading(true);

      const res = await api.put(`/orders/cancel/${id}`);

      if (res.data.success) {
        successToast(res.data.message);

        // update local state
        setOrders((prev) =>
          prev.map((order) =>
            order._id === id ? { ...order, orderStatus: "cancelled" } : order,
          ),
        );
      } else {
        errorToast(res.data.message);
      }

      return res.data;
    } catch (error) {
      const errData = error.response?.data;
      errorToast(errData?.message || error.message);
      return errData;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    orders,
    singleOrder,
    placeOrder,
    getMyOrders,
    getOrderById,
    cancelOrder,
  };
};
