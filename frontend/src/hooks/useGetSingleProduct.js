import { useCallback, useState } from "react";
import { getSingleProduct } from "../api/productApi";
import { errorToast } from "../Toast";

export const useGetSingleProduct = () => {
  const [loading, setLoading] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [product, setProduct] = useState(null);

  const fetchSingleProduct = useCallback(async (slug) => {
    try {
      setLoading(true);

      const data = await getSingleProduct(slug);

      if (data.success) {
        setProduct(data.product);
        setRelatedProducts(data.relatedProducts || []);
      } else {
        errorToast(data.message || "Failed to fetch product");
      }
    } catch (error) {
      const message =
        error?.response?.message || error.message || "Something went wrong";

      errorToast(message);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    product,
    relatedProducts,
    loading,
    fetchSingleProduct,
  };
};
