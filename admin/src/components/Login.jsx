import React from "react";
import { useForm } from "react-hook-form";
import { successToast, errorToast } from "../toast";
import { assets } from "../assets/assets";
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
    <div className="min-h-screen flex flex-col sm:flex-row">
      {/* IMAGE */}
      <div className="relative w-full sm:w-1/2 h-64 sm:h-auto">
        <img
          src={assets.image_hero2}
          alt=""
          className="w-full h-full object-cover"
        />

        <img
          src={assets.fornova_word}
          alt="Fornova"
          className="absolute top-6 md:top-20 left-1/2 -translate-x-1/2 text-3xl md:text-5xl font-black tracking-widest"
        />
      </div>

      {/* FORM CONTAINER */}
      <div className="w-full sm:w-1/2 flex items-center justify-center bg-gray-100 p-12 ">
        <form
          className="w-full max-w-md space-y-3 "
          onSubmit={handleSubmit(onSubmit)}
        >
          <h2 className="text-2xl font-bold mb-8 sm:text-4xl text-center">
            Admin Login
          </h2>

          <input
            type="email"
            placeholder="Email"
            autoFocus
            className="w-full mb-4 p-2 border rounded border-gray-400"
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
            className="w-full mb-4 p-2 border rounded border-gray-400"
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
            className={`flex items-center justify-between w-full py-2 px-4 rounded text-white ${
              isSubmitting ? "bg-gray-400" : "bg-black hover:bg-gray-800"
            }`}
          >
            {isSubmitting ? "Logging in..." : "Login"}
            <img
              src={assets.white_arrow}
              alt="Arrow"
              className="w-4 h-4 mr-2"
            />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
