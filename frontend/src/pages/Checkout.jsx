import React from "react";
import { useForm } from "react-hook-form";
import Title from "../components/Title";
import CartTotal from "../components/CartTotal";
import Container from "../components/Container";
import { assets } from "../assets/assets";
import { usePayment } from "../hooks/usePayment";

const Checkout = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({ mode: "onChange" });

  const onSubmit = (data) => {
    console.log("Checkout Data:", data);
  };

  return (
    <Container>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t"
      >
        {/* LEFT: FORM */}
        <div className="flex flex-col gap-4 w-full sm:max-w-[480px]">
          <div className="text-xl sm:text-2xl my-3">
            <Title text1="Checkout" text2="Details" />
          </div>
          <div className="bg-white p-6 rounded shadow-sm space-y-4">
            <h2 className="font-semibold text-lg">Shipping Information</h2>

            {/* NAME */}
            <div className="flex gap-3">
              <input
                {...register("firstName", {
                  required: "First name is required",
                })}
                placeholder="First Name"
                className="border border-gray-300 rounded  py-1.5 px-3.5 w-full"
              />
              <input
                {...register("lastName", { required: "Last name is required" })}
                placeholder="Last Name"
                className="border border-gray-300 rounded  py-1.5 px-3.5 w-full"
              />
            </div>

            {/* EMAIL */}
            <input
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: "Invalid email",
                },
              })}
              placeholder="Email Address"
              className="border border-gray-300 rounded  py-1.5 px-3.5 w-full"
            />

            {/* ADDRESS */}
            <input
              {...register("street", { required: "Street is required" })}
              placeholder="Street Address"
              className="border border-gray-300 rounded  py-1.5 px-3.5 w-full"
            />

            <div className="flex gap-3">
              <input
                {...register("city", { required: "City is required" })}
                placeholder="City"
                className="border border-gray-300 rounded  py-1.5 px-3.5 w-full"
              />
              <input
                {...register("state", { required: "State is required" })}
                placeholder="State"
                className="border border-gray-300 rounded  py-1.5 px-3.5 w-full"
              />
            </div>

            <div className="flex gap-3">
              <input
                {...register("zipcode", { required: "Zip code required" })}
                placeholder="Zip Code"
                className="border border-gray-300 rounded  py-1.5 px-3.5 w-full"
              />
              <input
                {...register("country", { required: "Country required" })}
                placeholder="Country"
                className="border border-gray-300 rounded  py-1.5 px-3.5 w-full"
              />
            </div>

            {/* PHONE */}
            <input
              {...register("phone", {
                required: "Phone number required",
                minLength: { value: 8, message: "Too short" },
              })}
              placeholder="Phone Number"
              className="border border-gray-300 rounded  py-1.5 px-3.5 w-full"
            />

            {/* ERROR DISPLAY */}
            {Object.values(errors).length > 0 && (
              <div className="text-red-500 text-sm space-y-1">
                {Object.values(errors).map((err, i) => (
                  <p key={i}>• {err.message}</p>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mt-8">
          <div className="mt-8 min-w-80">
            <CartTotal />
          </div>

          {/* RIGHT: SUMMARY */}
          <div className="mt-12 shadow-sm p-4 ">
            <Title text1={"PAYMENT"} text2={"METHOD"} />
            {/* ----------- Payment Method Selection ---------- */}
            <div className="flex gap-3 flex-col lg:flex-row ">
              <div className="flex items-center  gap-3 border p-2 px-3 cursor-pointer lg:w-50">
                <p
                  className={"min-w-3.5 h-3.5 border rounded-full bg-green-400"}
                ></p>
                <img className="h-5 mx-4" src={assets.stripe_logo} />
              </div>

              <div className="flex items-center gap-3 border p-2 px-3 cursor-pointer">
                <p
                  className={"min-w-3.5 h-3.5 border rounded-full bg-green-400"}
                ></p>
                <p className="text-gray-500  text-sm font-medium mx-4">
                  CASH ON DELIVERY
                </p>
              </div>
            </div>
            {/* ---------- Place order button --------- */}
            <div className="w-full text-end mt-8">
              <button
                type="submit"
                disabled={!isValid}
                className={`w-full mt-6 py-3 rounded font-medium transition 
            ${
              isValid
                ? "bg-lime-400 hover:bg-lime-500 text-black"
                : "bg-gray-200 hover:bg-gray-300 text-gray-700"
            }`}
              >
                Continue to Payment
              </button>
            </div>
          </div>
        </div>
      </form>
    </Container>
  );
};

export default Checkout;
