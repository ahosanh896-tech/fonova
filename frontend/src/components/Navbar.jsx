import { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { assets } from "../assets/assets";
import { Cart, Menu, RightArrow, Search, UserIcon } from "../Icon";
import UserMenu from "./UserMenu";

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const [hasShadow, setHasShadow] = useState(false);

  // for dropdown

  // scroll to top
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // use "auto" if you want instant like YouTube
    });
  };

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScroll = window.scrollY;

      // shadow only after small scroll
      setHasShadow(currentScroll > 10);

      // prevent tiny flicker
      if (Math.abs(currentScroll - lastScrollY) < 5) return;

      // hide/show navbar
      if (currentScroll > lastScrollY && currentScroll > 120) {
        setShowNavbar(false); // scrolling down
      } else {
        setShowNavbar(true); // scrolling up
      }

      lastScrollY = currentScroll;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div>
      {/* NAVBAR */}
      <div
        className={`fixed top-0 left-0 w-full z-50
          transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]
          bg-white/70 backdrop-blur-lg
          ${hasShadow ? "shadow-md" : "shadow-none"}
          ${showNavbar ? "translate-y-0" : "-translate-y-24"}
        `}
      >
        <div className="flex items-center justify-between py-2 md:py-4 font-medium px-4 sm:px-[4vw] md:px-[5vw] lg:px-[6vw]">
          {/* logo */}
          <Link to="/" onClick={scrollToTop}>
            <img src={assets.fornova} alt="" className="w-40 ml-[-10px]" />
          </Link>

          {/* desktop menu */}
          <ul className="hidden sm:flex gap-5 text-sm text-gray-700">
            <NavLink
              to="/"
              onClick={scrollToTop}
              className="flex flex-col items-center gap-1"
            >
              <p>HOME</p>
              <hr className="w-2/4 border-none h-px bg-gray-700 hidden" />
            </NavLink>

            <NavLink
              to="/collection"
              onClick={scrollToTop}
              className="flex flex-col items-center gap-1"
            >
              <p>COLLECTION</p>
              <hr className="w-2/4 border-none h-px bg-gray-700 hidden" />
            </NavLink>

            <NavLink to="/about" className="flex flex-col items-center gap-1">
              <p>ABOUT</p>
              <hr className="w-2/4 border-none h-px bg-gray-700 hidden" />
            </NavLink>

            <NavLink to="/contact" className="flex flex-col items-center gap-1">
              <p>CONTACT</p>
              <hr className="w-2/4 border-none h-px bg-gray-700 hidden" />
            </NavLink>
          </ul>

          {/* right icons */}
          <div className="flex items-center gap-6">
            <Search className="w-5 cursor-pointer" />
            <UserMenu />

            <Link to="/cart" className="relative">
              <Cart />
              <p className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white ml-1">
                56
              </p>
            </Link>

            <Menu
              onClick={() => setVisible(true)}
              className="w-5 cursor-pointer sm:hidden"
            />
          </div>
        </div>
      </div>

      {/* overlay */}
      {visible && (
        <div
          onClick={() => setVisible(false)}
          className="fixed inset-0 bg-black/30 z-50"
        />
      )}

      {/* mobile sidebar */}
      <div
        className={`fixed top-0 right-0 bg-white z-60 ${
          visible ? "w-56" : "w-0"
        } transition-all duration-500 h-screen overflow-hidden`}
      >
        <div className="flex flex-col text-gray-600">
          <div
            onClick={() => setVisible(false)}
            className="flex items-center gap-4 p-3 cursor-pointer"
          >
            <RightArrow className="h-5" />
            <p>Back</p>
          </div>

          <NavLink
            onClick={() => {
              setVisible(false);
              scrollToTop();
            }}
            to="/"
            className="py-2 pl-6 border"
          >
            HOME
          </NavLink>

          <NavLink
            onClick={() => {
              setVisible(false);
              scrollToTop();
            }}
            to="/collection"
            className="py-2 pl-6 border"
          >
            COLLECTION
          </NavLink>

          <NavLink
            onClick={() => setVisible(false)}
            to="/about"
            className="py-2 pl-6 border"
          >
            ABOUT
          </NavLink>

          <NavLink
            onClick={() => setVisible(false)}
            to="/contact"
            className="py-2 pl-6 border"
          >
            CONTACT
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
