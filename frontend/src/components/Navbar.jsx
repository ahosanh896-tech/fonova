import { useState, useEffect, useContext } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { Cart, Menu, NotificationIcon, RightArrow } from "../Icon";
import Search from "./Search";
import UserMenu from "./UserMenu";
import { ShopContext } from "../context/ShopContext";
import Notification from "./Notification";
import { useNotification } from "../hooks/useNotification";
import { useShop } from "../hooks/useShop";

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const [hasShadow, setHasShadow] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const { cartCount } = useContext(ShopContext);
  const { user } = useShop();

  const {
    notifications,
    unreadCount,
    fetchNotifications,
    markNotificationRead,
    markAllRead,
    deleteNotification,
    deleteAllNotifications,
  } = useNotification();

  const navigate = useNavigate();

  useEffect(() => {
    if (user) fetchNotifications();
  }, [user, fetchNotifications]);

  useEffect(() => {
    if (notificationsOpen) {
      fetchNotifications();
    }
  }, [notificationsOpen, fetchNotifications]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScroll = window.scrollY;

      setHasShadow(currentScroll > 10);

      if (Math.abs(currentScroll - lastScrollY) < 5) return;

      if (currentScroll > lastScrollY && currentScroll > 120) {
        setShowNavbar(false);
      } else {
        setShowNavbar(true);
      }

      lastScrollY = currentScroll;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div>
      {/* Navbar */}
      <div
        className={`fixed top-0 left-0 w-full z-50 transition-transform duration-500 ease-in-out
        bg-white/70 backdrop-blur-lg
        ${hasShadow ? "shadow-md" : "shadow-none"}
        ${showNavbar ? "translate-y-0" : "-translate-y-24"}`}
      >
        <div className="flex items-center justify-between py-3 md:py-4 px-4 sm:px-[4vw] md:px-[5vw] lg:px-[6vw]">
          {/* Logo */}
          <Link to="/" onClick={scrollToTop}>
            <img src={assets.fornova} alt="" className="w-40 -ml-2.5" />
          </Link>

          {/* Desktop Menu */}
          <ul className="hidden sm:flex gap-8 text-sm text-gray-700">
            <NavLink
              to="/"
              onClick={scrollToTop}
              className="flex flex-col items-center hover:text-black transition-colors "
            >
              <p>HOME</p>
              <hr className="w-2/4 hidden" />
            </NavLink>
            <NavLink
              to="/collection"
              onClick={scrollToTop}
              className="flex flex-col items-center hover:text-black transition-colors "
            >
              <p>COLLECTION</p>
              <hr className="w-2/4 hidden" />
            </NavLink>
            <NavLink
              to="/about"
              className="flex flex-col items-center hover:text-black transition-colors "
            >
              <p>ABOUT</p>
              <hr className="w-2/4 hidden" />
            </NavLink>
            <NavLink
              to="/contact"
              className="flex flex-col items-center hover:text-black transition-colors "
            >
              <p>CONTACT</p>
              <hr className="w-2/4 hidden" />
            </NavLink>
          </ul>

          {/* Right Icons */}
          <div className="flex items-center gap-3 sm:gap-6">
            <Search />
            <UserMenu />

            {/* Notification */}
            <button
              onClick={() => {
                if (!user) {
                  navigate("/login");
                  return;
                }
                setNotificationsOpen((prev) => !prev);
              }}
              className="relative"
            >
              <NotificationIcon />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] px-1.5 rounded-full">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Cart */}
            <Link to="/cart" className="relative">
              <Cart />
              {cartCount > 0 && (
                <p className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white ml-1">
                  {cartCount}
                </p>
              )}
            </Link>

            {/* Mobile Menu Button */}
            <Menu
              onClick={() => setVisible(true)}
              className="w-5 cursor-pointer sm:hidden"
            />
          </div>

          {/* Notification Dropdown */}
          <Notification
            notificationsOpen={notificationsOpen}
            setNotificationsOpen={setNotificationsOpen}
            notifications={notifications}
            unreadCount={unreadCount}
            markNotificationRead={markNotificationRead}
            markAllRead={markAllRead}
            deleteNotification={deleteNotification}
            deleteAllNotifications={deleteAllNotifications}
          />
        </div>
      </div>

      {/* Backdrop */}
      {visible && (
        <div
          onClick={() => setVisible(false)}
          className="fixed inset-0 bg-black/30 z-50"
        />
      )}

      {/* Mobile Sidebar */}
      <div
        className={`fixed top-0 right-0 bg-white z-[60] h-screen overflow-hidden transition-all duration-300 ${
          visible ? "w-64" : "w-0"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b">
            <p className="text-lg font-medium">Menu</p>
            <div
              onClick={() => setVisible(false)}
              className="flex items-center gap-2 cursor-pointer text-gray-600 hover:text-black"
            >
              <RightArrow className="h-4 rotate-180" />
              <span className="text-sm">Close</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-col mt-2 text-gray-700">
            <NavLink
              to="/"
              onClick={() => {
                setVisible(false);
                scrollToTop();
              }}
              className={({ isActive }) =>
                `px-6 py-3 text-sm transition-colors ${
                  isActive ? "bg-gray-100 font-medium" : "hover:bg-gray-50"
                }`
              }
            >
              HOME
            </NavLink>
            <NavLink
              to="/collection"
              onClick={() => {
                setVisible(false);
                scrollToTop();
              }}
              className={({ isActive }) =>
                `px-6 py-3 text-sm transition-colors ${
                  isActive ? "bg-gray-100 font-medium" : "hover:bg-gray-50"
                }`
              }
            >
              COLLECTION
            </NavLink>
            <NavLink
              to="/about"
              onClick={() => setVisible(false)}
              className={({ isActive }) =>
                `px-6 py-3 text-sm transition-colors ${
                  isActive ? "bg-gray-100 font-medium" : "hover:bg-gray-50"
                }`
              }
            >
              ABOUT
            </NavLink>
            <NavLink
              to="/contact"
              onClick={() => setVisible(false)}
              className={({ isActive }) =>
                `px-6 py-3 text-sm transition-colors ${
                  isActive ? "bg-gray-100 font-medium" : "hover:bg-gray-50"
                }`
              }
            >
              CONTACT
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
