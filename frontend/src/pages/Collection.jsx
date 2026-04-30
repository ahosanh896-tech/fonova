import { useEffect, useRef, useState, useMemo } from "react";
import ShopHero from "../components/ShopHero";
import Container from "../components/Container";
import { useProducts } from "../hooks/useProducts";
import { ProductItem } from "../components/ProductItem";
import { useForm, useWatch } from "react-hook-form";
import { LineVertical } from "../Icon";
import { useLocation, useSearchParams } from "react-router-dom";

const Collection = () => {
  const [page, setPage] = useState(1);
  const loaderRef = useRef(null);
  const location = useLocation();

  const { register, control, setValue } = useForm();
  const [searchParams] = useSearchParams();
  const { products, loading, fetchProducts, total, pages, clearProducts } =
    useProducts();

  // Watch filters
  const category = useWatch({ control, name: "category" });
  const subCategory = useWatch({ control, name: "subCategory" });
  const keyword = useWatch({ control, name: "keyword" });

  const minPrice = useWatch({ control, name: "minPrice" });
  const maxPrice = useWatch({ control, name: "maxPrice" });

  const sortType = useWatch({ control, name: "sortType" });

  const limit = 20;

  // Memoize filters to reduce effect runs
  const filters = useMemo(
    () => ({
      category,
      subCategory,
      keyword,
      minPrice,
      maxPrice,
      sortType,
    }),
    [category, subCategory, keyword, minPrice, maxPrice, sortType],
  );

  // Showing count
  const start = total === 0 ? 0 : (page - 1) * limit + 1;
  const end = total === 0 ? 0 : start + products.length - 1;

  useEffect(() => {
    if (location.state?.category) {
      setValue("category", location.state.category);
    }
  }, [location.state, setValue]);

  useEffect(() => {
    setValue("keyword", searchParams.get("keyword")?.trim() || "");
  }, [searchParams, setValue]);

  // Reset page and clear products when filters change
  useEffect(() => {
    clearProducts();
    setPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(filters)]);

  // Fetch products when page changes
  useEffect(() => {
    fetchProducts(page, limit, filters);
  }, [fetchProducts, page, limit, filters]);

  // Infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !loading && page < pages) {
        setPage((prev) => prev + 1);
      }
    });

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => observer.disconnect();
  }, [loading, page, pages]);

  return (
    <>
      <ShopHero />
      <div className="flex flex-row items-center justify-between px-4 sm:px-[4vw] md:px-[5vw] lg:px-[6vw] h-15 sm:h-20 bg-[#E5E5E0] text-sm gap-4">
        <div className="flex flex-row gap-2 items-center">
          <select {...register("category")} className="p-1 outline-none">
            <option value="">Category</option>
            <option value="dining">Dining</option>
            <option value="living">Living</option>
            <option value="bedroom">Bedroom</option>
          </select>

          <select {...register("subCategory")} className="p-1 outline-none">
            <option value="">SubCategory</option>
            <option value="chair">Chair</option>
            <option value="table">Table</option>
            <option value="sofa">Sofa</option>
            <option value="bed">Bed</option>
          </select>

          <LineVertical className="hidden md:block" />

          <p className="hidden md:block">
            Showing {start}-{end} of {total} results
          </p>
        </div>

        <div className="flex flex-row gap-2">
          <input
            type="number"
            placeholder="Min"
            className="w-10 text-center bg-gray-100 rounded outline-none p-1"
            {...register("minPrice")}
          />

          <input
            type="number"
            placeholder="Max"
            className="w-10 text-center bg-gray-100 rounded outline-none p-1"
            {...register("maxPrice")}
          />

          <select {...register("sortType")} className="outline-none ml-3">
            <option value="">Default</option>
            <option value="newest">Newest</option>
            <option value="low-high">Low to High</option>
            <option value="high-low">High to Low</option>
          </select>
        </div>
      </div>
      <Container>
        <div className="my-10 flex flex-col items-center gap-y-10">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 lg:gap-6">
            {products.map((item) => (
              <ProductItem
                key={item._id}
                id={item.slug}
                image={item.images?.[0]?.url}
                category={item.category}
                discount={item.discount}
                finalPrice={item.finalPrice}
                price={item.price}
                name={item.name}
              />
            ))}
          </div>

          {loading && (
            <p className="text-center text-gray-500">Loading more...</p>
          )}

          <div ref={loaderRef} className="h-10" />

          {!loading && page >= pages && (
            <p className="text-gray-400">No more products</p>
          )}
        </div>
      </Container>
    </>
  );
};

export default Collection;
