import React from "react";
import { assets } from "../assets/assets";
import { Link } from "react-router-dom";

const ShopHero = () => {
  return (
    <div className="relative w-full h-[220px] lg:h-[360px] md:h-[300px] overflow-hidden">
      {/* Background Image */}
      <img
        src={assets.shop_hero}
        alt="shop hero"
        className="
          absolute inset-0 w-full h-full 
          object-cover 
          object-[50%_85%] 
          md:object-[50%_75%] 
         
        "
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-white/20 backdrop-blur-[2px]" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10 text-center cursor-pointer">
        <h1 className="text-2xl md:text-4xl font-semibold mb-2">Shop</h1>

        <p className="text-sm md:text-base text-gray-700 ">
          <Link to="/" className="hover:underline">
            Home
          </Link>{" "}
          &gt; <span className="font-medium text-black">Shop</span>
        </p>
      </div>
    </div>
  );
};

export default ShopHero;
