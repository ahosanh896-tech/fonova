// src/hooks/useProducts.js
import { useCallback, useState } from "react";
import { getProducts } from "../api/productApi";
import { errorToast } from "../Toast";

export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);

  const fetchProducts = useCallback(
    async (pageNum = 1, limit, filters = {}) => {
      try {
        setLoading(true);

        const data = await getProducts({
          page: pageNum,
          ...(limit && { limit }),

          ...(filters.category && { category: filters.category }),
          ...(filters.subCategory && { subCategory: filters.subCategory }),
          ...(filters.keyword && { keyword: filters.keyword }),

          ...(filters.minPrice !== undefined && { minPrice: filters.minPrice }),
          ...(filters.maxPrice !== undefined && { maxPrice: filters.maxPrice }),

          ...(filters.sortType && {
            sort:
              filters.sortType === "low-high"
                ? "price_asc"
                : filters.sortType === "high-low"
                  ? "price_desc"
                  : filters.sortType === "newest"
                    ? "newest"
                    : undefined,
          }),
        });

        if (data.success) {
          if (pageNum === 1) {
            setProducts(data.products);
          } else {
            setProducts((prev) => [...prev, ...data.products]);
          }

          setPages(data.pages);
          setTotal(data.total);
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
    },
    [],
  );

  return { products, pages, total, loading, fetchProducts };
};
