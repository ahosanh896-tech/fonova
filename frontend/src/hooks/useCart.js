import { useState, useEffect } from "react";
import { get, add, update, remove, clear } from "../api/cartApi";
import { errorToast } from "../Toast";

export const useCart = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);

  // GET CART
  const fetchCart = async () => {
    try {
      setLoading(true);
      const res = await get();

      if (res.data.success) {
        setCart(res.data.cart);
      }
    } catch (err) {
      errorToast(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  // ADD
  const addToCart = async (productId) => {
    try {
      const res = await add(productId, 1);

      if (res.data.success) {
        fetchCart();
      }
    } catch (err) {
      errorToast(err.response?.data?.message || err.message);
    }
  };

  // UPDATE
  const updateCart = async (productId, quantity) => {
    try {
      const res = await update(productId, quantity);

      if (res.data.success) {
        fetchCart();
      }
    } catch (err) {
      errorToast(err.response?.data?.message || err.message);
    }
  };

  // REMOVE
  const removeFromCart = async (productId) => {
    try {
      const res = await remove(productId);

      if (res.data.success) {
        fetchCart();
      }
    } catch (err) {
      errorToast(err.response?.data?.message || err.message);
    }
  };

  // ClEAR
  const clearCart = async () => {
    try {
      const res = await clear();
      if (res.data.success) {
        setCart([]);
      }
    } catch (err) {
      errorToast(err.response?.data?.message || err.message);
    }
  };

  // TOTAL
  const getTotal = () => {
    return cart.reduce(
      (acc, item) => acc + item.productId.price * item.quantity,
      0,
    );
  };

  useEffect(() => {
    fetchCart();
  }, []);

  return {
    cart,
    loading,
    addToCart,
    updateCart,
    removeFromCart,
    getTotal,
    clearCart,
  };
};
