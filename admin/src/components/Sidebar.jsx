import { assets } from "../assets/assets";

import { NavLink } from "react-router-dom";

const Sidebar = ({ isOpen, onClose }) => {
  return (
    <div
      className={`fixed top-0 transition-all duration-500
        ${isOpen ? "left-0" : "-left-64"}
        lg:left-0`}
    >
      <div className="flex flex-col h-screen w-64 px-4 py-6 bg-white border-r border-gray-300 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-2 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 lg:hidden"
        >
          ✕
        </button>

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

        <button className=" flex items-center gap-4 mt-auto p-2 mx-2 bg-gray-200 border border-gray-400 rounded-md">
          <img className="w-5 h-5 ml-4" src={assets.login} alt="Login" />
          Login
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
