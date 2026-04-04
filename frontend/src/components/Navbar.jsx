import { useState } from "react";

import { Link, NavLink } from "react-router-dom";
import { assets } from "../assets/assets";
import { Cart, Menu, RightArrow, Search, UserIcon } from "../Icon";

const Navbar = () => {
  const [visible, setVisible] = useState(false);

  return (
    <div className="flex items-center justify-between py-5 font-medium">
      {/* logo */}
      <Link to="/">
        <img src={assets.fornova} alt="" className="w-40" />
      </Link>

      <ul className="hidden sm:flex gap-5 text-sm text-gray-700">
        <NavLink to="/" className="flex flex-col items-center gap-1">
          <p>HOME</p>
          <hr className="w-2/4 border-none h-[1px] bg-gray-700 hidden" />
        </NavLink>

        <NavLink to="/collection" className="flex flex-col items-center gap-1">
          <p>COLLECTION</p>
          <hr className="w-2/4 border-none h-[1px] bg-gray-700 hidden" />
        </NavLink>

        <NavLink to="/about" className="flex flex-col items-center gap-1">
          <p>ABOUT</p>
          <hr className="w-2/4 border-none h-[1px] bg-gray-700 hidden" />
        </NavLink>

        <NavLink to="/contact" className="flex flex-col items-center gap-1">
          <p>CONTACT</p>
          <hr className="w-2/4 border-none h-[1px] bg-gray-700 hidden" />
        </NavLink>
      </ul>

      {/* right icons */}
      <div className="flex items-center gap-6">
        <Search className="w-5 cursor-pointer" />

        <UserIcon className="w-5 cursor-pointer" />

        {/* cart */}
        <Link to="/cart" className="relative">
          <Cart />
          <p className="absolute  inset-0 flex items-center justify-center text-xs font-bold text-white ml-1  ">
            56
          </p>
        </Link>

        {/* mobile menu icon */}
        <Menu
          onClick={() => setVisible(true)}
          className="w-5 cursor-pointer sm:hidden"
        />
      </div>

      {/* sidebar menu (mobile) */}
      <div
        className={`absolute top-0 right-0 overflow-hidden bg-white   ${
          visible ? "w-56" : "w-0"
        } transition-all duration-500 h-screen`}
      >
        <div className="flex flex-col text-gray-600">
          {/* back button */}
          <div
            onClick={() => setVisible(false)}
            className="flex items-center gap-4 p-3 cursor-pointer"
          >
            <RightArrow className="h-5 " />
            <p>Back</p>
          </div>

          {/* links */}
          <NavLink
            onClick={() => setVisible(false)}
            className="py-2 pl-6 border"
            to="/"
          >
            HOME
          </NavLink>

          <NavLink
            onClick={() => setVisible(false)}
            className="py-2 pl-6 border"
            to="/collection"
          >
            COLLECTION
          </NavLink>

          <NavLink
            onClick={() => setVisible(false)}
            className="py-2 pl-6 border"
            to="/about"
          >
            ABOUT
          </NavLink>

          <NavLink
            onClick={() => setVisible(false)}
            className="py-2 pl-6 border"
            to="/contact"
          >
            CONTACT
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
