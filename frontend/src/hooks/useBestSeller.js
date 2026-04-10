import { useCallback, useState } from "react";
import { bestSellerApi } from "../api/bestSellerApi";
import { errorToast } from "../Toast";

export const useBestSeller = () => {
  const [products, setProducts] = useState([]);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchBestSeller = useCallback(async (pageNum = 1, limit) => {
    try {
      setLoading(true);

      const data = await bestSellerApi(pageNum, limit);

      if (data.success) {
        if (pageNum === 1) {
          setProducts(data.products);
        } else {
          setProducts((prev) => [...prev, ...data.products]);
        }
        setPages(data.pages);
      } else {
        errorToast(data.message || "Failed to fetch best sellers");
      }
    } catch (error) {
      errorToast(
        error?.response?.data?.message ||
          error.message ||
          "Something went wrong",
      );
    } finally {
      setLoading(false);
    }
  }, []);
  return {
    products,
    loading,
    pages,
    fetchBestSeller,
  };
};
