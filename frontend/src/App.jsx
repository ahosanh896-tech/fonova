import React, { useEffect } from "react";
import { Toaster } from "sonner";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Footer from "./components/Footer";
import { Routes, Route } from "react-router-dom";
import Collection from "./pages/Collection";
import Authpage from "./pages/AuthPage";
import VerifyOtpPage from "./pages/VerifyOtpPage";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPasswordOtp from "./pages/ResetPasswordOtp";

import { Product } from "./pages/Product";
import { useShop } from "./hooks/useShop";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";

const App = () => {
  const { checkAuth } = useShop();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <div>
      <Toaster
        position="top-right"
        richColors
        expand
        closeButton
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: "12px",
            padding: "14px 16px",
            fontSize: "14px",
          },
        }}
      />
      <Navbar />
      <div className="pt-20">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/collection" element={<Collection />} />
          <Route path="/product/:slug" element={<Product />} />
          <Route path="/login" element={<Authpage />} />
          <Route path="/verify-otp" element={<VerifyOtpPage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-otp" element={<ResetPasswordOtp />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/orders" element={<Orders />} />
        </Routes>
      </div>

      <Footer />
    </div>
  );
};

export default App;
