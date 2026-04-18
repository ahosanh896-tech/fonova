import React from "react";
import { Toaster } from "sonner";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Footer from "./components/Footer";
import { Routes, Route } from "react-router-dom";
import Collection from "./pages/Collection";
import ScrollManager from "./components/ScrollManager";
import Product from "./pages/Product";

const App = () => {
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
      <ScrollManager />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/collection" element={<Collection />} />
        <Route path="/product/:slug" element={<Product />} />
      </Routes>

      <Footer />
    </div>
  );
};

export default App;
