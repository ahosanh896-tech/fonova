import React, { useState, useEffect } from "react";
import { products } from "../assets/assets";

const Hero = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const total = products.length;

  const goToSlide = (index) => {
    const newIndex = (index + total) % total;
    setCurrentIndex(newIndex);
  };

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % total);
    }, 4000);

    return () => clearInterval(interval);
  }, [isPaused, total]);

  const currentProduct = products[currentIndex];

  return (
    <div
      className="flex flex-col sm:flex-row border border-gray-400 relative overflow-hidden"
      onMouseEnter={() => {
        setIsPaused(true);
        setIsHovered(true);
      }}
      onMouseLeave={() => {
        setIsPaused(false);
        setIsHovered(false);
      }}
    >
      {/* LEFT */}
      <div className="w-full sm:w-1/2 pl-8 pr-7 sm:pl-15 flex items-center justify-center py-10 sm:py-0">
        <div className="text-[#414141]">
          <div className="flex items-center gap-2">
            <p className="w-8 md:w-11 h-[2px] bg-[#414141] "></p>
            <p className="font-medium text-sm md:text-base">OUR BESTSELLERS</p>
          </div>

          <h1 className=" prata-regular text-black text-3xl sm:py-3 lg:text-5xl leading-relaxed">
            {currentProduct.name}
          </h1>

          <p className="mb-2 text-gray-500 ">{currentProduct.description}</p>

          <div className="flex items-center gap-2">
            <p className="font-semibold text-sm md:text-base">SHOP NOW</p>
            <p className="w-8 md:w-11 h-[1px] bg-[#414141] "></p>
          </div>
        </div>
      </div>

      {/* RIGHT */}
      <img
        className="w-full sm:w-1/2 object-cover"
        src={currentProduct.image}
        alt={currentProduct.name}
      />

      <button
        onClick={() => goToSlide(currentIndex - 1)}
        className={`absolute left-3 top-1/2 -translate-y-1/2 bg-white px-3 py-2 shadow rounded-full  ${isHovered ? "opacity-100" : "opacity-0 pointer-events-none"} transition-all duration-400`}
      >
        ◀
      </button>

      <button
        onClick={() => goToSlide(currentIndex + 1)}
        className={`absolute right-3 top-1/2 -translate-y-1/2 bg-white px-3 py-2 shadow rounded-full ${isHovered ? "opacity-100" : "opacity-0 pointer-events-none"} transition-all duration-400`}
      >
        ▶
      </button>
    </div>
  );
};

export default Hero;
