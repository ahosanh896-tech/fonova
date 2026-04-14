import api from "./api";

export const updateReview = async (id, reviewData) => {
  const res = await api.put(`/api/product/review/${id}`, reviewData);

  return res.data;
};
