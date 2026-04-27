import { useCallback, useState } from "react";
import {
  isAuthApi,
  loginApi,
  logoutApi,
  registerApi,
  resendOtpApi,
  resetPasswordApi,
  sendResetOtpApi,
  verifyOtpApi,
} from "../api/authApi";
import { errorToast, successToast } from "../Toast";

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  //REGISTER
  const registerUser = useCallback(async (payload) => {
    try {
      setLoading(true);
      const data = await registerApi(payload);

      if (data.success) {
        successToast(data.message);
      }

      return data;
    } catch (error) {
      const errData = error.response?.data;

      // IMPORTANT: return even on error
      if (errData?.message?.includes("OTP already sent")) {
        return errData;
      }

      errorToast(errData?.message || error.message);
      return errData;
    } finally {
      setLoading(false);
    }
  }, []);

  // LOGIN
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
      const errData = error.response?.data;

      errorToast(errData?.message || error.message);
      return errData;
    } finally {
      setLoading(false);
    }
  }, []);

  // LOGOUT
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

      return data;
    } catch (error) {
      const errData = error.response?.data;

      errorToast(errData?.message || error.message);
      return errData;
    } finally {
      setLoading(false);
    }
  }, []);

  // VERIFY OTP
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
      const errData = error.response?.data;

      errorToast(errData?.message || error.message);
      return errData;
    } finally {
      setLoading(false);
    }
  }, []);

  // RESEND OTP
  const resendOtp = useCallback(async (payload) => {
    try {
      setLoading(true);
      const data = await resendOtpApi(payload);

      if (data.success) {
        successToast("New OTP sent");
      } else {
        errorToast(data.message);
      }

      return data;
    } catch (error) {
      const errData = error.response?.data;

      errorToast(errData?.message || error.message);
      return errData;
    } finally {
      setLoading(false);
    }
  }, []);

  // SEND RESET OTP
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
      const errData = error.response?.data;

      errorToast(errData?.message || error.message);
      return errData;
    } finally {
      setLoading(false);
    }
  }, []);

  // RESET PASSWORD
  const resetPassword = useCallback(async (payload) => {
    try {
      setLoading(true);
      const data = await resetPasswordApi(payload);

      if (data.success) {
        successToast(data.message);
      } else {
        errorToast(data.message);
      }

      return data;
    } catch (error) {
      const errData = error.response?.data;

      errorToast(errData?.message || error.message);
      return errData;
    } finally {
      setLoading(false);
    }
  }, []);

  // CHECK AUTH
  const checkAuth = useCallback(async () => {
    try {
      const data = await isAuthApi();
      setUser(data.success ? data.user : null);
      return data;
    } catch {
      setUser(null);
      return null;
    }
  }, []);

  return {
    loading,
    user,
    registerUser,
    login,
    logout,
    verifyOtp,
    resendOtp,
    sendResetOtp,
    resetPassword,
    checkAuth,
  };
};
