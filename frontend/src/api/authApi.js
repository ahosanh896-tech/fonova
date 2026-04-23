import api from "./api";

export const register = async (userData) => {
  const res = await api.post("/api/auth/register", userData);
  return res.data;
};

export const login = async (userData) => {
  const res = await api.post("/api/auth/login", userData);
  return res.data;
};
