import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useShop } from "../hooks/useShop";
import { FloatingInput } from "../components/FlotingInput";
import { Mail, Lock, UserIcon } from "../Icon";
import { useForm, useWatch } from "react-hook-form";
import { successToast } from "../Toast";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const { login, registerUser, loading } = useShop();
  const navigate = useNavigate();

  const {
    register: formRegister,
    handleSubmit,
    control,
    formState: { errors, isValid },
  } = useForm({ mode: "onChange" });

  const nameValue = useWatch({ control, name: "name", defaultValue: "" });
  const emailValue = useWatch({ control, name: "email", defaultValue: "" });
  const passwordValue = useWatch({
    control,
    name: "password",
    defaultValue: "",
  });

  const onSubmit = async (data) => {
    if (isLogin) {
      const res = await login(data);

      if (res?.success) {
        navigate("/");
      } else if (res?.code === "EMAIL_NOT_VERIFIED") {
        localStorage.setItem("otpState", JSON.stringify({ email: data.email }));
        navigate("/verify-otp");
      }
    } else {
      const res = await registerUser(data);

      console.log("REGISTER RESPONSE:", res);

      // safer check
      if (res?.success || res?.message?.includes("OTP already sent")) {
        successToast("Redirecting to OTP...");

        localStorage.setItem("otpState", JSON.stringify({ email: data.email }));

        navigate("/verify-otp");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-10">
      <div className="w-full max-w-md space-y-4">
        {/* Title */}
        <div className="flex items-center justify-center gap-2 mb-8 mt-10 text-shadow-lg">
          <h2 className="prata-regular text-3xl text-center">
            {isLogin ? "Login" : "Create Account"}
          </h2>
          <hr className="h-[1.5px] w-6 bg-gray-800 border-none" />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {!isLogin && (
            <>
              <FloatingInput
                icon={UserIcon}
                placeholder="Name"
                value={nameValue}
                {...formRegister("name", { required: "Name required" })}
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name.message}</p>
              )}
            </>
          )}

          <FloatingInput
            icon={Mail}
            type="email"
            placeholder="Email"
            value={emailValue}
            {...formRegister("email", {
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Invalid email address",
              },
            })}
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}

          <FloatingInput
            icon={Lock}
            type="password"
            placeholder="Password"
            value={passwordValue}
            {...formRegister("password", {
              required: "Password is required",
              minLength: {
                value: 8,
                message: "Minimum 8 characters",
              },
              pattern: {
                value: /^(?=.*[A-Za-z])(?=.*\d)/,
                message: "Must include letters and numbers",
              },
            })}
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password.message}</p>
          )}

          {isLogin && (
            <p
              className="text-sm text-right cursor-pointer underline text-shadow-lg"
              onClick={() => navigate("/forgot-password")}
            >
              Forgot password?
            </p>
          )}

          <button
            disabled={loading || !isValid}
            className="w-full bg-black text-white py-2 shadow-lg "
          >
            {loading ? "Please wait..." : isLogin ? "Login" : "Register"}
          </button>
        </form>

        {/* Toggle */}
        <p className="text-center text-sm text-shadow-lg">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="underline ml-1"
          >
            {isLogin ? "Register" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
}
