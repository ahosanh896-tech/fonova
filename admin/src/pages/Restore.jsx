import React, { useEffect, useState } from "react";
import Api from "../api/api";
import { successToast, errorToast } from "../toast";
import { currency } from "../utils/currency..jsx";
import { useNavigate } from "react-router-dom";

const Restore = () => {
  const navigate = useNavigate();

  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const fetchTrash = async (pageNum = 1) => {
    try {
      setLoading(true);

      const res = await Api.get(`/api/product/trash?page=${pageNum}&limit=10`);

      if (res.data.success) {
        if (pageNum === 1) setList(res.data.products);
        else setList((prev) => [...prev, ...res.data.products]);

        setPages(res.data.pages);
      } else {
        errorToast(res.data.message);
      }
    } catch (error) {
      errorToast(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const restoreProduct = async (id) => {
    try {
      const res = await Api.put(`/api/product/restore/${id}`);
      if (res.data.success) {
        successToast(res.data.message);
        fetchTrash(1);
        setPage(1);
      } else {
        errorToast(res.data.message);
      }
    } catch (error) {
      errorToast(error.response?.data?.message || error.message);
    }
  };

  // Optional: hard delete permanently from Trash page
  const hardDeleteProduct = async (id) => {
    const ok = window.confirm("Permanently delete this product?");
    if (!ok) return;

    try {
      const res = await Api.delete(`/api/product/${id}`); // hard delete (no ?soft=true)
      if (res.data.success) {
        successToast(res.data.message);
        fetchTrash(1);
        setPage(1);
      } else {
        errorToast(res.data.message);
      }
    } catch (error) {
      errorToast(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    fetchTrash(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadMore = () => {
    const next = page + 1;
    setPage(next);
    fetchTrash(next);
  };

  if (loading) return <p className="text-center mt-5">Loading trash...</p>;

  return (
    <div className="w-full min-h-screen">
      <p className="mb-2 text-lg font-semibold">Soft Deleted Products</p>

      {list.length === 0 && (
        <p className="text-center text-gray-500 mt-4">No deleted products</p>
      )}

      <div className="flex flex-col gap-2">
        {list.map((item) => (
          <div
            key={item._id}
            className="grid grid-cols-[1fr_3fr_1fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center gap-2 text-sm border border-gray-200 p-2 rounded"
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

            <div className="flex items-center gap-2 justify-end">
              <button
                onClick={() => restoreProduct(item._id)}
                className="px-3 py-1 bg-black text-white rounded hover:bg-gray-800 text-xs"
              >
                Restore
              </button>

              <button
                onClick={() => hardDeleteProduct(item._id)}
                className="px-3 py-1 border border-red-400 text-red-500 rounded hover:bg-red-50 text-xs"
                title="Permanently delete"
              >
                Delete
              </button>

              <button
                onClick={() =>
                  navigate(`/update?id=${item._id}&slug=${item.slug}`)
                }
                className="px-3 py-1 border border-blue-300 text-blue-600 rounded hover:bg-blue-50 text-xs"
                title="Edit"
              >
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>

      {page < pages && (
        <button
          onClick={loadMore}
          className="px-4 py-2 bg-black text-white rounded mt-5"
        >
          Load More
        </button>
      )}
    </div>
  );
};

export default Restore;
