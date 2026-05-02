import { assets } from "../assets/assets";
import { NavLink } from "react-router-dom";
import Api from "../api/api";
import { successToast, errorToast } from "../toast";

const Sidebar = ({ isOpen, onClose, setUser }) => {
  const handleLogout = async () => {
    try {
      await Api.post("/api/auth/logout");
      setUser(null);
      successToast("Logged out successfully");
    } catch (error) {
      console.log(error);
      errorToast("Logout failed");
    }
  };

  const linkBase =
    "flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition " +
    "border border-transparent hover:bg-gray-100 hover:border-gray-200";

  const getActiveClass = ({ isActive }) =>
    isActive
      ? "bg-gray-600 text-white hover:bg-gray-900 border-gray-900"
      : "bg-white text-gray-700";

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <div
        className={`fixed z-50 top-0 h-screen transition-all duration-300
        ${isOpen ? "left-0" : "-left-64"} lg:left-0`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-full w-64 bg-white border-r border-gray-200 shadow-sm flex flex-col">
          {/* HEADER */}
          <div className="flex items-center justify-between px-5 py-4">
            <div className="flex items-center gap-3">
              <img
                src={assets.fornova}
                alt="Logo"
                className="w-[130px] hidden lg:block"
              />
              <h2 className="text-lg font-bold lg:hidden">Menu</h2>
            </div>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full shadow lg:hidden p-2  hover:bg-gray-100 "
            >
              ✕
            </button>
          </div>

          {/* NAV + LOGOUT */}
          <nav className="px-4 flex flex-col h-full">
            {/* TOP LINKS */}
            <div className="mt-2 space-y-2">
              <NavLink
                to="/add"
                onClick={onClose}
                className={(props) => `${linkBase} ${getActiveClass(props)}`}
              >
                <img className="w-5 h-5" src={assets.add} alt="Add" />
                <span className="font-semibold">ADD ITEMS</span>
              </NavLink>

              <NavLink
                to="/list"
                onClick={onClose}
                className={(props) => `${linkBase} ${getActiveClass(props)}`}
              >
                <img className="w-5 h-5" src={assets.list} alt="List" />
                <span className="font-semibold">LIST ITEMS</span>
              </NavLink>

              <NavLink
                to="/orders"
                onClick={onClose}
                className={(props) => `${linkBase} ${getActiveClass(props)}`}
              >
                <img className="w-5 h-5" src={assets.order} alt="Orders" />
                <span className="font-semibold">ORDERS</span>
              </NavLink>

              <NavLink
                to="/restore"
                onClick={onClose}
                className={(props) => `${linkBase} ${getActiveClass(props)}`}
              >
                <img className="w-5 h-5" src={assets.restore} alt="Restore" />
                <span className="font-semibold">RESTORE</span>
              </NavLink>
            </div>

            {/* PUSH LOGOUT TO BOTTOM */}
            <div className="mt-auto mb-10 pt-5 border-t border-gray-200">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-semibold
                           bg-white border border-gray-200 hover:bg-gray-100 transition"
              >
                <img className="w-5 h-5" src={assets.logout} alt="Logout" />
                Logout
              </button>
            </div>
          </nav>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
