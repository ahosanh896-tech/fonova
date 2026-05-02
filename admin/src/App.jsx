import React, { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import { Routes, Route, Navigate } from "react-router-dom";
import Add from "./pages/Add";
import List from "./pages/List";
import Orders from "./pages/Orders";
import Login from "./components/Login";
import { Toaster } from "sonner";
import Api from "./api/api";
import EditProduct from "./pages/EditProduct";

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await Api.get("/api/auth/is-auth");

        if (res.data?.user?.role === "admin") {
          setUser(res.data.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.log("Error checking authentication:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="bg-gray-50 min-h-screen ">
      <Toaster
        position="top-right"
        richColors
        toastOptions={{
          style: {
            borderRadius: "10px",
          },
        }}
      />
      {!user ? (
        <Login onLogin={setUser} />
      ) : (
        <>
          <Navbar onMenuClick={() => setIsSidebarOpen(true)} />

          <hr className="text-gray-300" />

          <div className="flex">
            <Sidebar
              setUser={setUser}
              isOpen={isSidebarOpen}
              onClose={() => setIsSidebarOpen(false)}
            />

            <div
              className={`flex-1 p-4 lg:ml-64 overflow-y-auto ${isSidebarOpen ? "opacity-50 bg-gray-300" : "opacity-100"} transition-all lg:opacity-100 lg:bg-gray-100 duration-300`}
            >
              <Routes>
                <Route path="/" element={<Navigate to="/add" />} />
                <Route path="/add" element={<Add />} />
                <Route path="/list" element={<List />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/update" element={<EditProduct />} />
                <Route path="*" element={<Navigate to="/add" />} />
              </Routes>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default App;
