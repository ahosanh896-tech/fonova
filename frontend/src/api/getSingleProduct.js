import { api } from "./api";

export const getSingleProduct = async (slug) => {
  const res = await api.get(`/api/product/slug/${slug}`);
  return res.data;
};
