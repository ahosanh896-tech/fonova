import { api } from "./api";

export const getProducts = async (params = {}) => {
  const res = await api.get("/api/product", {
    params,
  });

  return res.data;
};

export const getSingleProduct = async (slug) => {
  const res = await api.get(`/api/product/slug/${slug}`);
  return res.data;
};

export const addReview = async (id, reviewData) => {
  const res = await api.post(`/api/product/review/${id}`, reviewData);

  return res.data;
};

export const deleteReview = async (id) => {
  const res = await api.delete(`/api/product/review/${id}`);

  return res.data;
};

export const updateReview = async (id, reviewData) => {
  const res = await api.put(`/api/product/review/${id}`, reviewData);

  return res.data;
};

export const compareProducts = async (ids) => {
  const query = ids.join(",");

  const res = await api.get(`/api/product/compare?ids=${query}`);

  return res.data;
};
