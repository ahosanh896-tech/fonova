import React, { useEffect } from "react";
import { useBestSeller } from "../hooks/useBestSeller";
import Title from "./Title";
import { ProductItem } from "./ProductItem";

const BestSeller = () => {
  const { products, loading, fetchBestSeller } = useBestSeller();

  const LIMIT = 5;

  useEffect(() => {
    fetchBestSeller(1, LIMIT);
  }, [fetchBestSeller]);

  return (
    <div>
      <div className="my-10">
        <div className="text-center py-8 text-3xl">
          <Title text1={"BEST"} text2={"SELLERS"} />
        </div>

        {loading ? (
          <p className="text-center">Loading...</p>
        ) : (
          <div className=" grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4   lg:grid-cols-5 gap-4 lg:gap-6 ">
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
                showDiscount={false}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BestSeller;
