import { api } from "./api";

export const bestSellerApi = async (page = 1, limit) => {
  const res = await api.get("/api/product/bestsellers", {
    params: {
      page,
      ...(limit && { limit }),
    },
  });
  return res.data;
};
