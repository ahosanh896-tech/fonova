import React, { useEffect, useState } from "react";
import Api from "../api/api.jsx";
import { successToast, errorToast } from "../toast";
import { currency } from "../utils/currency..jsx";
const List = () => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const fetchList = async (pageNum = 1) => {
    try {
      setLoading(true);

      const response = await Api.get(`/api/product/?page=${pageNum}&limit=10`);

      if (response.data.success) {
        if (pageNum === 1) {
          setList(response.data.products);
        } else {
          setList((prev) => [...prev, ...response.data.products]);
        }

        setPages(response.data.pages);
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
        fetchList(1);
        setPage(1);
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

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchList(nextPage);
  };

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
              {item.finalPrice}
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

      {page < pages && (
        <div>
          <button
            onClick={loadMore}
            className="px-4 py-2 bg-black text-white rounded mt-5"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
};

export default List;
