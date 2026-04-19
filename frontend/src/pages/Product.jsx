import { useParams } from "react-router-dom";
import { useGetSingleProduct } from "../hooks/useGetSingleProduct";
import { useContext, useEffect } from "react";
import { ShopContext } from "../context/ShopContext";
import { ProductItem } from "../components/ProductItem";
import Title from "../components/Title";

export const Product = () => {
  const { slug } = useParams();
  const { currency } = useContext(ShopContext);

  const { product, relatedProducts, loading, fetchSingleProduct } =
    useGetSingleProduct();

  useEffect(() => {
    fetchSingleProduct(slug);
  }, [slug]);

  if (loading) return <p>Loading...</p>;
  if (!product) return <p>Not found</p>;

  return (
    <div className="px-4 sm:px-[5vw] lg:px-[6vw] py-10 bg-white">
      {/*  TOP SECTION  */}
      <div className="grid sm:grid-cols-2 gap-12">
        {/* LEFT: IMAGE GALLERY */}
        <div className="flex flex-col gap-4 sm:flex-row">
          {/* Thumbnails */}
          <div className="flex gap-3 sm:flex-col sm:order-1 order-2">
            {product.images?.map((img, i) => (
              <img
                key={i}
                src={img.url}
                className="w-16 md:w-18 md:h-18 lg:w-22 lg:h-22 h-16 object-cover rounded cursor-pointer"
              />
            ))}
          </div>

          {/* Main Image */}
          <div className="sm:order-2 order-1 w-full max-w-[300px] sm:max-w-[350px] md:max-w-[400px] lg:max-w-[600px]">
            <img
              src={product.images?.[0]?.url}
              className="w-full max-h-[300px] md:max-h-[400px] lg:max-h-[600px] object-cover rounded-lg bg-[#f5f5f5]"
            />
          </div>
        </div>

        {/* RIGHT: PRODUCT INFO */}
        <div>
          <h1 className="text-2xl font-semibold">{product.name}</h1>

          {/* Price */}
          <p className="text-black mt-2 text-3xl font-bold">
            {currency} {product.price}
          </p>

          <p className="text-sm mt-1">
            {product.stock > 0 ? (
              <span className="text-green-600">In Stock ({product.stock})</span>
            ) : (
              <span className="text-red-500">Out of Stock</span>
            )}
          </p>

          {/* Rating */}

          <div className="flex items-center gap-2 mt-2">
            <span className="text-yellow-500 text-xl">
              {"★".repeat(Math.round(product?.rating || 0))}
              {"☆".repeat(5 - Math.round(product?.rating || 0))}
            </span>

            <span className="text-sm text-gray-500">
              {product?.numReviews > 0
                ? `(${product.numReviews})`
                : "(No reviews)"}
            </span>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-600 mt-4 max-w-md">
            {product.shortDescription}
          </p>

          {/* specifications */}
          {product?.attributes && (
            <div>
              <h2 className="font-bold text-gray-700 py-1 ">Specifications</h2>

              <div>
                {product.attributes.material && (
                  <div className="flex gap-6  text-sm">
                    <span className="text-gray-500">Material :</span>
                    <span>{product.attributes.material}</span>
                  </div>
                )}

                {product.attributes.color && (
                  <div className="flex gap-11 text-sm">
                    <span className="text-gray-500">Color:</span>
                    <span>{product.attributes.color}</span>
                  </div>
                )}

                {product.attributes.weight && (
                  <div className="flex gap-9 text-sm">
                    <span className="text-gray-500">Weight:</span>
                    <span>{product.attributes.weight} kg</span>
                  </div>
                )}

                {product.attributes.dimensions && (
                  <div className="py-1">
                    <p className="font-bold text-gray-600">Dimensions</p>
                    <div className="flex gap-4 py-1 text-sm">
                      <span>L: {product.attributes.dimensions.length} cm</span>
                      <span>W: {product.attributes.dimensions.width} cm</span>
                      <span>H: {product.attributes.dimensions.height} cm</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Quantity + Buttons */}
          <div className="flex  gap-4 mt-6 text-sm ">
            <div className="flex items-center w-20 md:w-25 justify-between bg-gray-100 shadow py-2 rounded hover:bg-gray-200 active:bg-gray-300 transition-all  ">
              <button className="pl-2">-</button>
              <span className="px-1">1</span>
              <button className="pr-2">+</button>
            </div>

            <button className="flex items-center w-25 md:w-30 justify-around bg-gray-100 shadow  py-2 hover:bg-gray-200 rounded transition-all active:bg-gray-300">
              Add To Cart
            </button>

            <button className="flex items-center w-25 md:w-30 justify-around  bg-gray-100 shadow py-2 rounded hover:bg-gray-200 active:bg-gray-300 transition-all">
              + Compare
            </button>
          </div>

          <hr className="mt-8 sm:w-full lg:w-4/5 xl:w-4/6 text-gray-400" />

          {/* Meta Info */}
          <div className="mt-6 text-sm text-gray-500 space-y-1">
            <p>SKU : SS001</p>
            <p>Category : {product.category}</p>
            <p>Tags : sofa, chair, home</p>
          </div>
        </div>
      </div>

      {/*TABS*/}
      <div className="mt-16">
        <div className="flex gap-6 border-b">
          <button className="pb-2 border-b-2 border-black">Description</button>
          <button className="pb-2 text-gray-400">Additional Information</button>
          <button className="pb-2 text-gray-400">
            Reviews ({product.numReviews})
          </button>
        </div>

        <div className="mt-6 text-gray-600 max-w-3xl text-sm leading-6">
          {product.description}
        </div>
      </div>

      {/* RELATED PRODUCTS */}
      <div className="mt-16">
        <div className="text-center py-8 text-3xl">
          <Title text1={"RELATED"} text2={"PRODUCTS"} />
        </div>

        <div className=" grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4   lg:grid-cols-5 gap-4 lg:gap-6 ">
          {relatedProducts.map((item) => (
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
      </div>
    </div>
  );
};
