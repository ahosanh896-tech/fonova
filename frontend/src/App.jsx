import React from "react";
import { Toaster } from "sonner";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";

const App = () => {
  return (
    <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
      <Toaster
        position="top-right"
        richColors
        toastOptions={{
          style: {
            borderRadius: "10px",
          },
        }}
      />
      <Navbar />
      <Home />
    </div>
  );
};

export default App;
