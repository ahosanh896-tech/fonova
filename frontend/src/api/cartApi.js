import api from "./api";

export const getCartItems = async () => {
  const res = await api.get("/api/cart");
  return res.data;
};

export const addToCart = async ({ productId, quantity }) => {
  const res = await api.post("/api/cart/add", { productId, quantity });
  return res.data;
};

export const updateCartItem = async ({ productId, quantity }) => {
  const res = await api.put("/api/cart/update", { productId, quantity });
  return res.data;
};

export const removeFromCart = async (productId) => {
  const res = await api.delete(`/api/cart/remove/${productId}`);
  return res.data;
};

export const clearCart = async () => {
  const res = await api.delete("/api/cart/clear");
  return res.data;
};
