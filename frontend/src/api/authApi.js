import { api } from "./api";

export const registerApi = async (data) => {
  const res = await api.post("/api/auth/register", data);
  return res.data;
};

export const loginApi = async (data) => {
  const res = await api.post("/api/auth/login", data);
  return res.data;
};

export const logoutApi = async () => {
  const res = await api.post("/api/auth/logout");
  return res.data;
};

export const verifyOtpApi = async (data) => {
  const res = await api.post("/api/auth/verify-otp", data);
  return res.data;
};

export const resendOtpApi = async (data) => {
  const res = await api.post("/api/auth/resend-verify-otp", data);
  return res.data;
};

export const sendResetOtpApi = async (data) => {
  const res = await api.post("/api/auth/send-reset-otp", data);
  return res.data;
};

export const isAuthApi = async () => {
  const res = await api.get("/api/auth/is-auth");
  return res.data;
};

export const resetPasswordApi = async (data) => {
  const res = await api.post("/api/auth/reset-password", data);
  return res.data;
};
