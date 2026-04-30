import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { api } from "../api/api";
import { errorToast } from "../Toast";

const Success = () => {
  const [params] = useSearchParams();
  const sessionId = params.get("session_id");
  const navigate = useNavigate();

  const { clearCart, fetchCart } = useContext(ShopContext);

  const [status, setStatus] = useState("loading"); // loading | success | error

  useEffect(() => {
    const verifyPayment = async () => {
      if (!sessionId) {
        setStatus("error");
        return;
      }

      const sessionKey = `stripe_success_${sessionId}`;
      if (sessionStorage.getItem(sessionKey)) {
        setStatus("success");
        return;
      }

      try {
        const res = await api.post("/api/payment/stripe/verify-session", {
          session_id: sessionId,
        });

        if (res.data.success) {
          await clearCart();
          await fetchCart();

          sessionStorage.setItem(sessionKey, "verified");
          setStatus("success");
        } else {
          setStatus("error");
          errorToast(res.data.message);
        }
      } catch (error) {
        setStatus("error");
        const errData = error.response?.data;
        errorToast(errData?.message || error.message);
      }
    };

    verifyPayment();
  }, [sessionId, clearCart, fetchCart]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      {/*LOADING */}
      {status === "loading" && (
        <>
          <div className="animate-spin w-12 h-12 border-4 border-gray-300 border-t-green-500 rounded-full mb-4" />
          <h2 className="text-lg font-medium">Verifying payment...</h2>
        </>
      )}

      {/* SUCCESS */}
      {status === "success" && (
        <>
          <div className="text-green-500 text-5xl mb-4">✔</div>
          <h1 className="text-2xl font-semibold mb-2">Payment Successful</h1>
          <p className="text-gray-500 mb-6">
            Your order has been placed successfully.
          </p>

          <div className="flex gap-4">
            <button
              onClick={() => navigate("/orders")}
              className="px-6 py-2 bg-black text-white rounded"
            >
              View Orders
            </button>

            <button
              onClick={() => navigate("/")}
              className="px-6 py-2 border rounded"
            >
              Continue Shopping
            </button>
          </div>
        </>
      )}

      {/* ERROR */}
      {status === "error" && (
        <>
          <div className="text-red-500 text-5xl mb-4">✖</div>
          <h1 className="text-2xl font-semibold mb-2">Payment Failed</h1>
          <p className="text-gray-500 mb-6">
            Something went wrong. Please try again.
          </p>

          <button
            onClick={() => navigate("/cart")}
            className="px-6 py-2 bg-black text-white rounded"
          >
            Back to Cart
          </button>
        </>
      )}
    </div>
  );
};

export default Success;
