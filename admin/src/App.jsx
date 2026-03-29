import React, { useState } from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import { Routes, Route, Navigate } from "react-router-dom";
import Add from "./pages/Add";
import List from "./pages/List";
import Orders from "./pages/Orders";
import Login from "./components/Login";
import Api from "./api/api";

const App = () => {
  const [user, setUser] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="bg-gray-50 min-h-screen">
      {!user ? (
        <Login />
      ) : (
        <>
          <Navbar onMenuClick={() => setIsSidebarOpen(true)} />

          <hr className="text-gray-300" />

          <div className="flex w-full">
            <Sidebar
              isOpen={isSidebarOpen}
              onClose={() => setIsSidebarOpen(false)}
            />

            <div className="flex-1 p-4">
              <Routes>
                <Route path="/" element={<Navigate to="/Add" />} />
                <Route path="/Add" element={<Add />} />
                <Route path="/List" element={<List />} />
                <Route path="/Orders" element={<Orders />} />
                <Route path="*" element={<Navigate to="/Add" />} />
              </Routes>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default App;
