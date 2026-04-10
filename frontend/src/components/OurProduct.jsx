import React, { useEffect } from "react";
import { useProducts } from "../hooks/useProducts";
import Title from "./Title";
import { ProductItem } from "./ProductItem";

const OurProduct = () => {
  const { products, loading, fetchProducts } = useProducts();

  const LIMIT = 10;

  useEffect(() => {
    fetchProducts(1, LIMIT);
  }, [fetchProducts]);

  return (
    <div>
      <div className="my-10">
        <div className="text-center py-8 text-3xl">
          <Title text1={"OUR"} text2={"PRODUCTS"} />
        </div>

        {loading ? (
          <p className="text-center">Loading...</p>
        ) : (
          <div className=" grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4   lg:grid-cols-5 gap-4 lg:gap-6 ">
            {products.map((item) => (
              <ProductItem
                key={item._id}
                id={item._id}
                image={item.images?.[0]?.url}
                category={item.category}
                discount={item.discount}
                finalPrice={item.finalPrice}
                price={item.price}
                name={item.name}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OurProduct;
