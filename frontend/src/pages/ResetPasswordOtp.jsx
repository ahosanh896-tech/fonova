import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useShop } from "../hooks/useShop";
import { useNavigate } from "react-router-dom";

const ResetPasswordOtp = () => {
  const { resetPassword, sendResetOtp, loading } = useShop();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      otp: "",
    },
  });

  const [email] = useState(() => {
    const saved = JSON.parse(localStorage.getItem("resetState") || "null");
    return saved?.email || "";
  });
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(60);
  const [showPassword, setShowPassword] = useState(false);

  const inputRefs = useRef([]);

  // ✅ REGISTER OTP FIELD (IMPORTANT FIX)
  useEffect(() => {
    register("otp", {
      required: "OTP is required",
      minLength: {
        value: 6,
        message: "OTP must be 6 digits",
      },
    });
  }, [register]);

  // Redirect if email is not available
  useEffect(() => {
    if (!email) {
      navigate("/login");
      return;
    }

    setTimeout(() => {
      inputRefs.current[0]?.focus();
    }, 0);
  }, [email, navigate]);

  // Timer
  useEffect(() => {
    if (timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  // OTP change
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

    // Auto submit (safe version)
    if (
      otpValue.length === 6 &&
      getValues("password") &&
      getValues("confirmPassword") === getValues("password")
    ) {
      handleSubmit(onSubmit)();
    }
  };

  // Backspace navigation
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Paste OTP
  const handlePaste = (e) => {
    const paste = e.clipboardData.getData("text").slice(0, 6);

    if (!/^\d+$/.test(paste)) return;

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

    if (
      paste.length === 6 &&
      getValues("password") &&
      getValues("confirmPassword") === getValues("password")
    ) {
      handleSubmit(onSubmit)();
    }
  };

  // Submit
  const onSubmit = async (data) => {
    const res = await resetPassword({
      email,
      otp: data.otp,
      newPassword: data.password,
    });

    if (res?.success) {
      localStorage.removeItem("resetState");
      navigate("/login");
    }
  };

  // Resend OTP
  const handleResend = async () => {
    if (timer > 0) return;

    const res = await sendResetOtp({ email });

    if (res?.success) {
      setTimer(60);
      setOtp(["", "", "", "", "", ""]);
      setValue("otp", "");
      inputRefs.current[0]?.focus();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-6 rounded-xl shadow w-full max-w-md space-y-4"
      >
        <h2 className="text-xl text-center font-semibold">Reset Password</h2>

        {/* OTP */}
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

        {/* Password */}
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="New Password"
            {...register("password", {
              required: "Password required",
              minLength: {
                value: 6,
                message: "Min 6 characters",
              },
            })}
            className="w-full border p-2 rounded pr-10"
          />

          <span
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-2 cursor-pointer"
          >
            {showPassword ? "🙈" : "👁️"}
          </span>
        </div>

        {errors.password && (
          <p className="text-red-500 text-sm">{errors.password.message}</p>
        )}

        {/* Confirm Password */}
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Confirm Password"
          {...register("confirmPassword", {
            required: "Confirm your password",
            validate: (value) =>
              value === getValues("password") || "Passwords do not match",
          })}
          className="w-full border p-2 rounded"
        />

        {errors.confirmPassword && (
          <p className="text-red-500 text-sm">
            {errors.confirmPassword.message}
          </p>
        )}

        <p className="text-sm text-center text-gray-500">Sent to {email}</p>

        {/* Resend */}
        <button
          type="button"
          onClick={handleResend}
          disabled={timer > 0}
          className="underline w-full"
        >
          {timer > 0 ? `Resend in ${timer}s` : "Resend OTP"}
        </button>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading || !isValid}
          className="w-full bg-black text-white py-2 disabled:opacity-50"
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
};

export default ResetPasswordOtp;
