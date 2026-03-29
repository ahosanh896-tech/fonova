import React from "react";
import { assets } from "../assets/assets";

const Navbar = ({ onMenuClick }) => {
  return (
    <div className=" relative flex items-center justify-between px-5 py-4 bg-white ">
      <img
        src={assets.menu}
        alt="Menu"
        className="w-6 h-6 cursor-pointer"
        onClick={onMenuClick}
      />
      <img
        src={assets.fornova}
        alt="Logo"
        className="absolute left-1/2 -translate-x-1/2 w-[max(10%,150px)]"
      />

      <div className="flex items-center gap-4">
        <img src={assets.search} className="w-6 h6 cursor-pointer" />
        <img src={assets.notification} className="w-6 h-6 cursor-pointer" />
      </div>
    </div>
  );
};

export default Navbar;
