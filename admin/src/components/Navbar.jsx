import React from "react";
import { assets } from "../assets/assets";

const Navbar = ({ onMenuClick }) => {
  return (
    <div className="sticky top-0 z-50 relative flex items-center justify-between px-5 py-4 bg-white">
      <div className="flex items-center gap-4">
        <img
          src={assets.menu}
          alt="Menu"
          className="w-6 h-6 cursor-pointer lg:hidden"
          onClick={onMenuClick}
        />
      </div>

      <img
        src={assets.fornova}
        alt="Logo"
        className="absolute block left-1/2 -translate-x-1/2 w-[120px] lg:hidden"
      />

      <div className="hidden lg:flex items-center w-[40%]">
        <input
          type="text"
          placeholder="Search..."
          className="w-full px-4 py-2 border rounded-full outline-none"
        />
      </div>

      <div className="flex items-center gap-4">
        <img src={assets.search} className="w-6 h-6 cursor-pointer lg:hidden" />

        <img src={assets.notification} className="w-6 h-6 cursor-pointer" />
      </div>
    </div>
  );
};

export default Navbar;
