import api from "./api";

export const get = async () => {
  const res = await api.get("/api/cart");
  return res.data;
};

export const add = async ({ productId, quantity }) => {
  const res = await api.post("/api/cart/add", { productId, quantity });
  return res.data;
};

export const update = async ({ productId, quantity }) => {
  const res = await api.put("/api/cart/update", { productId, quantity });
  return res.data;
};

export const remove = async (productId) => {
  const res = await api.delete(`/api/cart/remove/${productId}`);
  return res.data;
};

export const clear = async () => {
  const res = await api.delete("/api/cart/clear");
  return res.data;
};
