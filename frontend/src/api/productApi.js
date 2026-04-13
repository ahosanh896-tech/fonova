import { api } from "./api";

export const getProducts = async (params = {}) => {
  const res = await api.get("/api/product", {
    params,
  });

  return res.data;
};
