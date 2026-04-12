import React from "react";
import { Toaster } from "sonner";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Footer from "./components/Footer";
import { Routes, Route } from "react-router-dom";
import Collection from "./pages/Collection";
import ScrollManager from "./components/ScrollManager";

const App = () => {
  return (
    <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
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
      </Routes>

      <Footer />
    </div>
  );
};

export default App;
