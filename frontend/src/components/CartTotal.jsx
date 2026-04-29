import React, { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";

const CartTotal = () => {
  const { currency, total = 0 } = useContext(ShopContext);

  // HELPER
  const round = (num) => Math.round(num * 100) / 100;

  // CONFIG
  const FREE_SHIPPING_THRESHOLD = 500;
  const SHIPPING_FEE = 20;
  const TAX_RATE = 0.08;

  // SHIPPING
  const delivery_fee =
    total === 0 ? 0 : total >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;

  // ROUND TAX
  const tax = round(total * TAX_RATE);

  // ROUND FINAL TOTAL
  const finalTotal = round(total + delivery_fee + tax);

  return (
    <div className="w-full bg-white p-5 rounded shadow-sm">
      <div className="text-xl mb-4">
        <Title text1="CART" text2="TOTALS" />
      </div>

      <div className="flex flex-col gap-3 text-sm">
        {/* SUBTOTAL */}
        <div className="flex justify-between">
          <p className="text-gray-600">Subtotal</p>
          <p className="font-medium">
            {currency} {round(total).toFixed(2)}
          </p>
        </div>

        <hr />

        {/* SHIPPING */}
        <div className="flex justify-between">
          <p className="text-gray-600">Shipping</p>
          <p className="font-medium">
            {delivery_fee === 0
              ? "Free"
              : `${currency} ${delivery_fee.toFixed(2)}`}
          </p>
        </div>

        {/* FREE SHIPPING MESSAGE */}
        {total > 0 && total < FREE_SHIPPING_THRESHOLD && (
          <p className="text-xs text-green-600">
            Add {currency} {(FREE_SHIPPING_THRESHOLD - total).toFixed(2)} more
            for FREE shipping
          </p>
        )}

        <hr />

        {/* TAX */}
        <div className="flex justify-between">
          <p className="text-gray-600">Tax (8%)</p>
          <p className="font-medium">
            {currency} {tax.toFixed(2)}
          </p>
        </div>

        <hr />

        {/* TOTAL */}
        <div className="flex justify-between text-lg font-semibold">
          <span>Total</span>
          <span>
            {currency} {finalTotal.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CartTotal;
