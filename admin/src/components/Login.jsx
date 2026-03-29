import React from "react";
import { useForm } from "react-hook-form";
import { successToast, errorToast } from "../toast";
import api from "../api/api";

const Login = ({ onLogin }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const cleanData = {
        email: data.email.trim(),
        password: data.password.trim(),
      };

      const res = await api.post("/api/auth/login", cleanData);

      if (!res.data.user) {
        errorToast("Invalid login");
        return;
      }

      if (res.data.user.role !== "admin") {
        errorToast("Admin access only");
        return;
      }

      successToast("Login successful");
      onLogin(res.data.user);
    } catch (error) {
      errorToast(error?.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-6 rounded shadow-md w-[320px]"
      >
        <h2 className="text-xl mb-4 text-center">Admin Login</h2>

        <input
          type="email"
          placeholder="Email"
          autoFocus
          className="w-full mb-2 p-2 border"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^\S+@\S+\.\S+$/,
              message: "Invalid email",
            },
          })}
        />
        {errors.email && (
          <p className="text-red-500 text-sm">{errors.email.message}</p>
        )}

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-2 p-2 border"
          {...register("password", {
            required: "Password is required",
          })}
        />
        {errors.password && (
          <p className="text-red-500 text-sm">{errors.password.message}</p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-2 text-white ${
            isSubmitting ? "bg-gray-400" : "bg-black"
          }`}
        >
          {isSubmitting ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;
