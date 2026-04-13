import { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { assets } from "../assets/assets";
import { Cart, Menu, RightArrow, Search, UserIcon } from "../Icon";
import Container from "./Container";

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScroll = window.scrollY;

      //prevent tiny scroll flicker
      if (Math.abs(currentScroll - lastScrollY) < 5) return;

      // sticky only after some scroll (IMPORTANT)
      if (currentScroll > 80) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }

      // hide/show on scroll direction
      if (currentScroll > lastScrollY) {
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
      <Container>
        <div
          className={`w-full z-50 transition-all duration-300 ease-in-out ${
            isSticky
              ? `fixed top-0 left-0 bg-white/90 backdrop-blur-md shadow-sm ${
                  showNavbar
                    ? "translate-y-0 opacity-100"
                    : "-translate-y-full opacity-0"
                }`
              : "relative"
          }`}
        >
          <div
            className={`flex items-center justify-between py-2 md:py-4 font-medium ${
              isSticky ? "px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]" : "px-0"
            }`}
          >
            {/* logo */}
            <Link to="/">
              <img src={assets.fornova} alt="" className="w-40" />
            </Link>

            {/* desktop menu */}
            <ul className="hidden sm:flex gap-5 text-sm text-gray-700">
              <NavLink to="/" className="flex flex-col items-center gap-1">
                <p>HOME</p>
                <hr className="w-2/4 border-none h-px bg-gray-700 hidden" />
              </NavLink>

              <NavLink
                to="/collection"
                className="flex flex-col items-center gap-1"
              >
                <p>COLLECTION</p>
                <hr className="w-2/4 border-none h-px bg-gray-700 hidden" />
              </NavLink>

              <NavLink to="/about" className="flex flex-col items-center gap-1">
                <p>ABOUT</p>
                <hr className="w-2/4 border-none h-px bg-gray-700 hidden" />
              </NavLink>

              <NavLink
                to="/contact"
                className="flex flex-col items-center gap-1"
              >
                <p>CONTACT</p>
                <hr className="w-2/4 border-none h-px bg-gray-700 hidden" />
              </NavLink>
            </ul>

            {/* right icons */}
            <div className="flex items-center gap-6">
              <Search className="w-5 cursor-pointer" />
              <UserIcon className="w-5 cursor-pointer" />

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
              onClick={() => setVisible(false)}
              to="/"
              className="py-2 pl-6 border"
            >
              HOME
            </NavLink>

            <NavLink
              onClick={() => setVisible(false)}
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
      </Container>
    </div>
  );
};

export default Navbar;
