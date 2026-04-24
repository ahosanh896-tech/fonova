import { useCallback, useState } from "react";
import { registerApi } from "../api/authApi";
import { errorToast, successToast } from "../Toast";

const useAuth = () => {
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
};
