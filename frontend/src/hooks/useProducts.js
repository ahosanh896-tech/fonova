// src/hooks/useProducts.js
import { useCallback, useState } from "react";
import { getProducts } from "../api/productApi";
import { errorToast } from "../Toast";

export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchProducts = useCallback(async (pageNum = 1, limit) => {
    try {
      setLoading(true);

      const data = await getProducts(pageNum, limit);

      if (data.success) {
        if (pageNum === 1) {
          setProducts(data.products);
        } else {
          setProducts((prev) => [...prev, ...data.products]);
        }

        setPages(data.pages);
      } else {
        // backend returned success: false
        errorToast(data.message || "Failed to fetch products");
      }
    } catch (err) {
      // axios error handling
      const message =
        err?.response?.data?.message || err.message || "Something went wrong";

      errorToast(message);
    } finally {
      setLoading(false);
    }
  }, []);

  return { products, pages, loading, fetchProducts };
};
