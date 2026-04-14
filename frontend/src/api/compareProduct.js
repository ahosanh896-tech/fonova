import api from "./api";

export const compareProducts = async (ids) => {
  const query = ids.join(",");

  const res = await api.get(`/api/product/compare?ids=${query}`);

  return res.data;
};
