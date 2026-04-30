import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { api } from "../api/api";
import { errorToast } from "../Toast";

const Success = () => {
  const [params] = useSearchParams();
  const sessionId = params.get("session_id");

  const { clearCart, fetchCart } = useContext(ShopContext);

  useEffect(() => {
    const verifyPayment = async () => {
      if (!sessionId) return;

      const sessionKey = `stripe_success_${sessionId}`;
      if (sessionStorage.getItem(sessionKey)) return;

      try {
        const res = await api.post("/api/payment/stripe/verify-session", {
          session_id: sessionId,
        });

        if (res.data.success) {
          await clearCart();
          await fetchCart();
          sessionStorage.setItem(sessionKey, "verified");
        } else {
          errorToast(res.data.message);
        }
      } catch (error) {
        const errData = error.response?.data;
        errorToast(errData?.message || error.message);
      }
    };

    verifyPayment();
  }, [sessionId, clearCart, fetchCart]);

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>Payment Successful</h1>
      <p>Your order has been placed.</p>
    </div>
  );
};

export default Success;
