import { useCallback, useState } from "react";
import {
  loginApi,
  logoutApi,
  registerApi,
  resendOtpApi,
  sendResetOtpApi,
  verifyOtpApi,
} from "../api/authApi";
import { errorToast, successToast } from "../Toast";

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  const register = useCallback(async (payload) => {
    try {
      setLoading(true);
      const data = await registerApi(payload);

      if (data.success) {
        successToast(data.message);
      } else {
        errorToast(data.message);
      }

      return data;
    } catch (error) {
      errorToast(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (payload) => {
    try {
      setLoading(true);
      const data = await loginApi(payload);

      if (data.success) {
        setUser(data.user);
        successToast(data.message);
      } else {
        errorToast(data.message);
      }
      return data;
    } catch (error) {
      errorToast(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      setLoading(true);

      const data = await logoutApi();

      if (data.success) {
        setUser(null);
        successToast(data.message);
      } else {
        errorToast(data.message);
      }
    } catch (error) {
      errorToast(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const verifyOtp = useCallback(async (payload) => {
    try {
      setLoading(true);

      const data = await verifyOtpApi(payload);

      if (data.success) {
        successToast(data.message);
      } else {
        errorToast(data.message);
      }
      return data;
    } catch (error) {
      errorToast(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const resendOtp = useCallback(async (payload) => {
    try {
      setLoading(true);

      const data = await resendOtpApi(payload);

      if (data.success) {
        successToast(data.message);
      } else {
        errorToast(data.message);
      }
      return data;
    } catch (error) {
      errorToast(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const sendResetOtp = useCallback(async (payload) => {
    try {
      setLoading(true);

      const data = await sendResetOtpApi(payload);

      if (data.success) {
        successToast(data.message);
      } else {
        errorToast(data.message);
      }
      return data;
    } catch (error) {
      errorToast(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  }, []);
};
