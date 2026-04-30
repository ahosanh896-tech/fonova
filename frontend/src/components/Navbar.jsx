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

  // fetch notifications
  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user, fetchNotifications]);

  // scroll to top
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
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
      {/* NAVBAR */}
      <div
        className={`fixed top-0 left-0 w-full z-50
          transition-transform duration-500 ease-in-out
          bg-white/70 backdrop-blur-lg
          ${hasShadow ? "shadow-md" : "shadow-none"}
          ${showNavbar ? "translate-y-0" : "-translate-y-24"}
        `}
      >
        <div className="flex items-center justify-between py-2 md:py-4 font-medium px-4 sm:px-[4vw] md:px-[5vw] lg:px-[6vw]">
          {/* logo */}
          <Link to="/" onClick={scrollToTop}>
            <img src={assets.fornova} alt="" className="w-40 -ml-2.5" />
          </Link>

          {/* desktop menu */}
          <ul className="hidden sm:flex gap-5 text-sm text-gray-700">
            <NavLink to="/" onClick={scrollToTop}>
              <p>HOME</p>
            </NavLink>

            <NavLink to="/collection" onClick={scrollToTop}>
              <p>COLLECTION</p>
            </NavLink>

            <NavLink to="/about">
              <p>ABOUT</p>
            </NavLink>

            <NavLink to="/contact">
              <p>CONTACT</p>
            </NavLink>
          </ul>

          {/* right icons */}
          <div className="relative flex items-center gap-6">
            <Search />
            <UserMenu />

            {/* NOTIFICATION BUTTON */}
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

            <Link to="/cart" className="relative">
              <Cart />
              {cartCount > 0 && (
                <p className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white ml-1">
                  {cartCount}
                </p>
              )}
            </Link>

            <Menu
              onClick={() => setVisible(true)}
              className="w-5 cursor-pointer sm:hidden"
            />
          </div>

          {/* NOTIFICATION DROPDOWN */}
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
