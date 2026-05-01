import { useContext } from "react";
import { Link } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";

export const ProductItem = ({
  id,
  image,
  name,
  price,
  discount,
  finalPrice,
  category,
  showDiscount = true, // new prop (default true)
}) => {
  const { currency } = useContext(ShopContext);

  return (
    <Link
      to={`/product/${id}`}
      className="group block bg-gray-100 overflow-hidden 
        shadow-sm hover:shadow-md hover:bg-gray-200 
        transition duration-300"
    >
      <div className="relative overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-56 object-cover group-hover:scale-105 transition duration-300"
        />

        {showDiscount && discount > 0 && (
          <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
            - {discount}%
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-3 text-start">
        <p className="text-sm font-bold text-gray-700">{name}</p>
        <p className="text-sm text-gray-500">{category}</p>

        <div className="mt-2">
          {showDiscount && discount > 0 && finalPrice ? (
            <>
              <span className="font-semibold text-gray-900">
                {currency}
                {finalPrice}
              </span>
              <span className="text-gray-400 text-sm line-through ml-2">
                {price}
              </span>
            </>
          ) : (
            <span className="font-semibold text-gray-900">
              {currency}
              {price}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};
