// hooks/usePayment.js
import { useState, useCallback } from "react";
import { api } from "../api/api";
import { errorToast } from "../Toast";

export const usePayment = () => {
  const [loading, setLoading] = useState(false);

  const createStripePayment = useCallback(async (payload) => {
    try {
      setLoading(true);

      const res = await api.post("/api/stripe/create-session", payload);

      if (res.data.success) {
        // THIS IS THE REDIRECT
        window.location.href = res.data.url;
      } else {
        errorToast(res.data.message);
      }
    } catch (error) {
      const errData = error.response?.data;
      errorToast(errData?.message || error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    createStripePayment,
    loading,
  };
};
