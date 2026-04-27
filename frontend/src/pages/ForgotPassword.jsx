import { useForm } from "react-hook-form";
import { useShop } from "../hooks/useShop";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const { register, handleSubmit } = useForm();
  const { sendResetOtp, loading } = useShop();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    const res = await sendResetOtp({ email: data.email });

    if (res?.success) {
      localStorage.setItem("resetState", JSON.stringify({ email: data.email }));
      navigate("/reset-otp");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-6 rounded-xl shadow w-full max-w-md space-y-4"
      >
        <h2 className="text-xl text-center font-semibold">Forgot Password</h2>

        <input
          type="email"
          placeholder="Enter your email"
          {...register("email", { required: true })}
          className="w-full border p-2 rounded"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white py-2"
        >
          {loading ? "Sending..." : "Send OTP"}
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
