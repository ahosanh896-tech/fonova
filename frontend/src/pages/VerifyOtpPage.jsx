import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useShop } from "../hooks/useShop";
import { useNavigate } from "react-router-dom";
import { successToast } from "../Toast";

const VerifyOtpPage = () => {
  const { handleSubmit, setValue } = useForm();
  const { verifyOtp, resendOtp, loading } = useShop();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(60);

  const inputRefs = useRef([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("otpState") || "null");

    if (!saved?.email) {
      navigate("/login");
      return;
    }

    setEmail(saved.email);
    inputRefs.current[0]?.focus();
  }, []);

  // countdown
  useEffect(() => {
    if (timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    setValue("otp", newOtp.join(""));

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newOtp.every((d) => d !== "")) {
      handleSubmit(onSubmit)();
    }
  };

  const onSubmit = async () => {
    const res = await verifyOtp({ email, otp: otp.join("") });

    if (res?.success) {
      localStorage.removeItem("otpState");
      successToast("Account verified. Please log in.");
      navigate("/login");
    }
  };

  const handleResend = async () => {
    if (timer > 0) return;

    const res = await resendOtp({ email });

    if (res?.success) {
      setTimer(60);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white p-6 rounded-xl shadow w-full max-w-md space-y-6">
        <h2 className="text-xl text-center font-semibold">Verify OTP</h2>

        <div className="flex justify-between gap-2">
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={(el) => (inputRefs.current[i] = el)}
              value={digit}
              onChange={(e) => handleChange(e.target.value, i)}
              maxLength={1}
              className="w-12 h-12 text-center border rounded-md"
            />
          ))}
        </div>

        <p className="text-center text-sm text-gray-500">Sent to {email}</p>

        <button
          onClick={handleResend}
          disabled={timer > 0}
          className="underline disabled:opacity-50 text-center w-full"
        >
          {timer > 0 ? `Resend in ${timer}s` : "Resend OTP"}
        </button>

        <button
          onClick={handleSubmit(onSubmit)}
          disabled={loading}
          className="w-full bg-black text-white py-2"
        >
          {loading ? "Verifying..." : "Verify"}
        </button>
      </div>
    </div>
  );
};

export default VerifyOtpPage;
