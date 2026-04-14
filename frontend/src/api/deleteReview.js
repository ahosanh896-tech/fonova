import api from "./api";

export const deleteReview = async (id) => {
  const res = await api.delete(`/api/product/review/${id}`);

  return res.data;
};
