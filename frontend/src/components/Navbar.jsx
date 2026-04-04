import { useState } from "react";

import { Link, NavLink } from "react-router-dom";
import { assets } from "../assets/assets";

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
        <img className="w-5 cursor-pointer" src={assets.search} alt="" />

        <img className="w-5 cursor-pointer" src={assets.person} alt="" />

        {/* cart */}
        <Link to="/cart" className="relative">
          <img className="w-5 min-w-5" src={assets.cart} alt="" />
          <p className="absolute right-[-5px] text-center leading-4 text-white bg-black aspect-square rounded-full text-[8px] w-4 bottom-[-2px]">
            0
          </p>
        </Link>

        {/* mobile menu icon */}
        <img
          className="w-5 cursor-pointer sm:hidden"
          src={assets.menu}
          alt=""
        />
      </div>

      {/* sidebar menu (mobile) */}
      <div
        className={`absolute top-0 right-0 overflow-hidden bg-white transition-all h-screen ${
          visible ? "w-full" : "w-0"
        }`}
      >
        <div className="flex flex-col text-gray-600">
          {/* back button */}
          <div
            onClick={() => setVisible(false)}
            className="flex items-center gap-4 p-3 cursor-pointer"
          >
            <img
              className="h-6 rotate-180"
              src={assets.double_arrow_right}
              alt=""
            />
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
