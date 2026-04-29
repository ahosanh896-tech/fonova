import { useState, useCallback } from "react";
import { api } from "../api/api";
import { errorToast } from "../Toast";

export const usePayment = () => {
  const [loading, setLoading] = useState(false);

  const createStripePayment = useCallback(async ({ items, address }) => {
    try {
      setLoading(true);

      const res = await api.post("api/payment/stripe/create-session", {
        items,
        address,
      });

      if (res.data.success) {
        // redirect to Stripe
        window.location.href = res.data.url;
      } else {
        errorToast(res.data.message);
      }

      return res.data;
    } catch (error) {
      const errData = error.response?.data;
      errorToast(errData?.message || error.message);
      return errData;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    createStripePayment,
  };
};
