import React, { useEffect, useState } from "react";
import Api from "../api/api";
import { successToast, errorToast } from "../toast";
import { currency } from "../utils/currency..jsx";
import { useNavigate } from "react-router-dom";

const List = () => {
  const navigate = useNavigate();

  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  // store last deleted product to show "Restore" (Undo)
  const [lastDeleted, setLastDeleted] = useState(null);

  const fetchList = async (pageNum = 1) => {
    try {
      setLoading(true);

      const response = await Api.get(`/api/product/?page=${pageNum}&limit=10`);

      if (response.data.success) {
        if (pageNum === 1) setList(response.data.products);
        else setList((prev) => [...prev, ...response.data.products]);

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

  useEffect(() => {
    fetchList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchList(nextPage);
  };

  // SOFT DELETE (restoreable)
  const deleteProduct = async (id, title = "") => {
    try {
      const response = await Api.delete(`/api/product/${id}?soft=true`);

      if (response.data.success) {
        successToast(response.data.message);

        // set last deleted for restore UI
        setLastDeleted({ id, title });

        // refresh list
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

  // RESTORE
  const restoreProduct = async (id, title = "") => {
    try {
      const response = await Api.put(`/api/product/restore/${id}`);

      if (response.data.success) {
        successToast(response.data.message);

        setLastDeleted(null);

        // refresh list
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

  if (loading) {
    return <p className="text-center mt-5">Loading products...</p>;
  }

  return (
    <div className="w-full min-h-screen">
      <p className="mb-2 text-lg font-semibold">All Products List</p>

      {/* Restore bar */}
      {lastDeleted && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded flex items-center justify-between gap-3">
          <div>
            <p className="font-semibold">Deleted: {lastDeleted.title}</p>
            <p className="text-sm text-gray-600">
              Click restore to bring it back.
            </p>
          </div>

          <button
            onClick={() => restoreProduct(lastDeleted.id, lastDeleted.title)}
            className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
          >
            Restore
          </button>
        </div>
      )}

      <div className="flex flex-col gap-2">
        {/* Table Header */}
        <div className="hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr_1fr] items-center py-2 px-3 bg-gray-100 text-sm font-semibold">
          <span>Image</span>
          <span>Name</span>
          <span>Category</span>
          <span>Price</span>
          <span className="text-center">Edit</span>
          <span className="text-center">Delete</span>
        </div>

        {list.length === 0 && (
          <p className="text-center text-gray-500 mt-4">No products found</p>
        )}

        {list.map((item) => (
          <div
            key={item._id}
            onDoubleClick={() => {
              // Edit page expects:
              // GET /api/product/slug/:slug  -> use slug
              // PUT /api/product/:id         -> use _id
              if (!item?._id || !item?.slug) return;

              navigate(`/update?id=${item._id}&slug=${item.slug}`);
            }}
            className="cursor-pointer grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr_1fr] items-center gap-2 text-sm border border-gray-200 p-2 rounded"
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

            {/* Edit button (optional, double click also works) */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/update?id=${item._id}&slug=${item.slug}`);
              }}
              className="text-blue-600 hover:text-blue-800 font-semibold"
              title="Edit"
            >
              Edit
            </button>

            {/* Delete button (soft delete) */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                deleteProduct(item._id, item.name);
              }}
              className="text-red-500 hover:text-red-700 text-lg text-right md:text-center"
              title="Delete (soft)"
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
