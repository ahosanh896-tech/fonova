import api from "./api";

export const getProducts = async (page = 1, limit) => {
  const res = await api.get("/api/product/", {
    params: {
      page,
      ...(limit && { limit }),
    },
  });

  return res.data;
};
