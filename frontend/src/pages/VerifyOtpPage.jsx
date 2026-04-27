import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useShop } from "../hooks/useShop";
import { useNavigate } from "react-router-dom";

const VerifyOtpPage = () => {
  const { register, handleSubmit, setValue, getValues } = useForm({
    mode: "onChange",
    defaultValues: { otp: "" },
  });
  const { verifyOtp, resendOtp, loading } = useShop();
  const navigate = useNavigate();

  const [email] = useState(() => {
    const saved = JSON.parse(localStorage.getItem("otpState") || "null");
    return saved?.email || "";
  });
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(60);

  const inputRefs = useRef([]);

  useEffect(() => {
    register("otp", {
      required: "OTP is required",
      minLength: {
        value: 6,
        message: "OTP must be 6 digits",
      },
    });
  }, [register]);

  useEffect(() => {
    if (!email) {
      navigate("/login");
      return;
    }

    setTimeout(() => {
      inputRefs.current[0]?.focus();
    }, 0);
  }, [email, navigate]);

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

    const otpValue = newOtp.join("");
    setValue("otp", otpValue, {
      shouldValidate: true,
      shouldDirty: true,
    });

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    if (otpValue.length === 6) {
      handleSubmit(onSubmit)();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData("text").trim().slice(0, 6);

    if (!/^[0-9]+$/.test(paste)) return;

    const newOtp = paste.split("");
    setOtp(newOtp);
    setValue("otp", paste, {
      shouldValidate: true,
      shouldDirty: true,
    });

    newOtp.forEach((digit, i) => {
      if (inputRefs.current[i]) {
        inputRefs.current[i].value = digit;
      }
    });

    inputRefs.current[5]?.focus();

    if (paste.length === 6) {
      handleSubmit(onSubmit)();
    }
  };

  const onSubmit = async () => {
    const res = await verifyOtp({ email, otp: getValues("otp") });

    if (res?.success) {
      localStorage.removeItem("otpState");
      navigate("/login");
    }
  };

  const handleResend = async () => {
    if (timer > 0) return;

    const res = await resendOtp({ email });

    if (res?.success) {
      setTimer(60);
      setOtp(["", "", "", "", "", ""]);
      setValue("otp", "", {
        shouldValidate: true,
        shouldDirty: true,
      });
      inputRefs.current[0]?.focus();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white p-6 rounded-xl shadow w-full max-w-md space-y-6">
        <h2 className="text-xl text-center font-semibold">Verify OTP</h2>

        <div className="flex justify-between gap-2" onPaste={handlePaste}>
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={(el) => (inputRefs.current[i] = el)}
              value={digit}
              onChange={(e) => handleChange(e.target.value, i)}
              onKeyDown={(e) => handleKeyDown(e, i)}
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
