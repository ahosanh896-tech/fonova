import React, { useEffect, useState } from "react";
import Api from "../api/api.jsx";
import { successToast, errorToast } from "../toast";
import { currency } from "../utils/currency..jsx";
const List = () => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchList = async () => {
    try {
      setLoading(true);

      const response = await Api.get("/api/product/");

      if (response.data.success) {
        setList(response.data.products);
      } else {
        errorToast(response.data.message);
      }
    } catch (error) {
      console.log(error);
      errorToast(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const removeProduct = async (id) => {
    try {
      const response = await Api.delete(`/api/product/${id}`);

      if (response.data.success) {
        successToast(response.data.message);
        fetchList();
      } else {
        errorToast(response.data.message);
      }
    } catch (error) {
      console.log(error);
      errorToast(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  if (loading) {
    return <p className="text-center mt-5">Loading products...</p>;
  }

  return (
    <div className="w-full min-h-screen">
      <p className="mb-2 text-lg font-semibold">All Products List</p>

      <div className="flex flex-col gap-2">
        {/* Table Header */}
        <div className="hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center py-2 px-3 bg-gray-100 text-sm font-semibold">
          <span>Image</span>
          <span>Name</span>
          <span>Category</span>
          <span>Price</span>
          <span className="text-center">Action</span>
        </div>

        {list.length === 0 && (
          <p className="text-center text-gray-500 mt-4">No products found</p>
        )}

        {list.map((item) => (
          <div
            key={item._id}
            className="grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center gap-2 text-sm border border-gray-200 p-2 rounded"
          >
            <img
              className="w-12 h-12 object-cover rounded"
              src={item.images?.[0]?.url || "/placeholder.png"}
              alt={item.name}
            />

            <p className="truncate">{item.name}</p>

            <p>{item.category}</p>

            <p>
              {currency}
              {item.price}
            </p>

            <button
              onClick={() => removeProduct(item._id)}
              className="text-red-500 hover:text-red-700 text-lg text-right md:text-center"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default List;
