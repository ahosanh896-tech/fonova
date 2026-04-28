import { api } from "./api";

export const getCartApi = async () => {
  const res = await api.get("/api/cart");
  return res.data;
};

export const addToCartApi = async ({ productId, quantity }) => {
  const res = await api.post("/api/cart/add", { productId, quantity });
  return res.data;
};

export const updateCartApi = async ({ productId, quantity }) => {
  const res = await api.put("/api/cart/update", { productId, quantity });
  return res.data;
};

export const removeFromCartApi = async (productId) => {
  const res = await api.delete("/api/cart/remove", {
    data: { productId },
  });
  return res.data;
};

export const clearCartApi = async () => {
  const res = await api.delete("/api/cart/clear");
  return res.data;
};
