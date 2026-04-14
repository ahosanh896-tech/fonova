import api from "./api";

export const addReview = async (id, reviewData) => {
  const res = await api.post(`/api/product/review/${id}`, reviewData);

  return res.data;
};
