import React, { useEffect, useRef, useState } from "react";
import { UserIcon } from "../Icon";
import { useShop } from "../hooks/useShop";
import { useNavigate } from "react-router-dom";

const UserMenu = () => {
  const { user, logout } = useShop();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const menuRef = useRef();

  // close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="relative" ref={menuRef}>
      <UserIcon
        className="w-5 cursor-pointer"
        onClick={() => {
          if (!user) return navigate("/login");
          setOpen((prev) => !prev);
        }}
      />

      {user && open && (
        <div className="absolute right-0 mt-3 w-40 bg-white shadow-lg rounded-lg border z-50">
          <div className="flex flex-col text-sm text-gray-700">
            <button
              onClick={() => navigate("/orders")}
              className="px-4 py-2 text-left hover:bg-gray-100"
            >
              Orders
            </button>

            <button
              onClick={handleLogout}
              className="px-4 py-2 text-left hover:bg-red-100 text-red-600"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
