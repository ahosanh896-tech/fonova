import React from "react";
import { Toaster } from "sonner";
import Navbar from "./components/Navbar";

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
    </div>
  );
};

export default App;
