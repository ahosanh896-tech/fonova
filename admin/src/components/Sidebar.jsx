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
  return (
    <div
      className={`fixed z-100 top-0 transition-all duration-500
        ${isOpen ? "left-0" : "-left-64"}
         lg:left-0`}
    >
      <div className="flex flex-col h-screen w-64 px-4 py-4 bg-white border-r border-gray-300 relative">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold lg:hidden">Menu</h2>
          <img
            src={assets.fornova}
            alt="Logo"
            className=" lg:block w-[150px] hidden"
          />
          <button onClick={onClose} className=" lg:hidden">
            ✕
          </button>
        </div>

        <div className="flex flex-col mt-15 space-y-2 text-sm ">
          <NavLink
            to="/add"
            className=" flex items-center px-4 py-2 rounded-md text-gray-800 hover:bg-gray-200 gap-3  "
          >
            <img className="w-5 h-5 ml-4" src={assets.add} alt="Add" />
            <p>ADD ITEMS</p>
          </NavLink>
          <NavLink
            to="/list"
            className="flex items-center px-4 py-2 rounded-md text-gray-800 hover:bg-gray-200 gap-3"
          >
            <img className="w-5 h-5 ml-4" src={assets.list} alt="List" />
            <p>LIST ITEMS</p>
          </NavLink>
          <NavLink
            to="/orders"
            className="flex items-center px-4 py-2 rounded-md  text-gray-800 hover:bg-gray-200 gap-3"
          >
            <img className="w-5 h-5 ml-4" src={assets.order} alt="Order" />
            <p>ORDERS</p>
          </NavLink>
        </div>

        <button
          onClick={handleLogout}
          className=" flex items-center gap-4 mt-auto p-2 mx-2 hover:bg-gray-200 border border-gray-400 rounded-md active:bg-gray-300"
        >
          <img className="w-5 h-5 ml-4" src={assets.logout} alt="Logout" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
