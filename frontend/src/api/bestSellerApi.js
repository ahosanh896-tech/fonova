import { api } from "./api";

export const bestSellerApi = async (params = {}) => {
  const res = await api.get("/api/product/bestsellers", {
    params,
  });
  return res.data;
};
