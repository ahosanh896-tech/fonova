import { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import Container from "../components/Container";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const {
    cart = [],
    updateCart,
    removeFromCart,
    clearCart,
    loading,
    currency,
    user,
    cartCount,
  } = useContext(ShopContext);

  const navigate = useNavigate();

  if (loading) {
    return <p className="text-center mt-10">Loading cart...</p>;
  }

  // PRICE LOGIC
  const getFinalPrice = (product) => {
    if (!product) return 0;

    if (product.finalPrice) return product.finalPrice;

    return product.price - (product.price * (product.discount || 0)) / 100;
  };

  const totalItems = cart.reduce((acc, item) => acc + (item.quantity || 0), 0);

  const subtotal = cart.reduce((acc, item) => {
    const product = item.productId;
    return acc + getFinalPrice(product) * (item.quantity || 0);
  }, 0);

  const tax = subtotal * 0.08;
  const shipping = subtotal > 500 ? 0 : 20;
  const finalTotal = subtotal + tax + shipping;

  return (
    <div className=" border-t border-gray-300 mb-15">
      <Container className="max-w-7xl mx-auto">
        {/* TITLE */}
        <div className="text-3xl p-4">
          <Title text1="Shopping" text2="Cart" />
        </div>

        {/* MAIN LAYOUT */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-20 bg-gray-100 rounded">
          {/* LEFT SIDE */}
          <div className="md:col-span-2 lg:col-span-3 p-6 max-w-4xl">
            <h2 className="text-lg font-semibold pb-3">Item Details</h2>

            {cart.length === 0 ? (
              <p className="text-gray-500 mt-6">Your cart is empty</p>
            ) : (
              cart.map((item, index) => {
                const product = item.productId;
                if (!product) return null;

                const finalPrice = getFinalPrice(product);

                return (
                  <div
                    key={item._id || index}
                    className="flex flex-col sm:flex-row justify-between py-6 border-b border-gray-200 bg-white px-4 rounded mb-4"
                  >
                    {/* LEFT */}
                    <div className="flex gap-6 w-full">
                      <img
                        src={product.images?.[0]?.url || "/placeholder.png"}
                        alt={product.name}
                        className="w-24 h-24 object-contain"
                      />

                      <div className="flex-1">
                        <h3 className="font-medium">{product.name}</h3>

                        <p className="text-sm text-gray-500">
                          {product.brand || "Premium Product"}
                        </p>

                        {/* PRICE */}
                        <div className="flex mt-1 items-center">
                          <span className="w-20 text-lg font-bold text-black">
                            {currency} {finalPrice.toFixed(2)}
                          </span>

                          {product.discount > 0 && (
                            <span className="w-20 line-through text-xs text-gray-400">
                              {currency} {product.price.toFixed(2)}
                            </span>
                          )}
                        </div>

                        {/* QUANTITY */}
                        <div className="flex items-center gap-3 mt-3 border border-gray-300 w-24 justify-between px-2 py-1 rounded">
                          <button
                            onClick={() => {
                              if (item.quantity <= 1) {
                                removeFromCart(product._id);
                              } else {
                                updateCart(product._id, item.quantity - 1);
                              }
                            }}
                          >
                            -
                          </button>

                          <span>{item.quantity}</span>

                          <button
                            onClick={() =>
                              updateCart(product._id, item.quantity + 1)
                            }
                            disabled={item.quantity >= product.stock}
                            className="disabled:opacity-40"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* RIGHT */}
                    <div className="flex flex-row sm:flex-col items-end justify-between mt-4 sm:mt-0 sm:ml-auto px-3">
                      <div className="font-semibold w-20">
                        {currency} {(finalPrice * item.quantity).toFixed(2)}
                      </div>

                      <button
                        onClick={() => removeFromCart(product._id)}
                        className="w-20 text-sm text-gray-500 hover:underline mr-3 mt-2 sm:mt-4"
                      >
                        ✕ Remove
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* RIGHT SIDE - SUMMARY */}
          {cartCount > 0 && (
            <div className="bg-white p-6 rounded shadow-sm h-fit md:col-span-1 lg:col-span-1 md:sticky md:top-24 m-6 md:mr-4 mt-4 md:mt-16">
              <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal ({totalItems} items)</span>
                  <span>
                    {currency} {subtotal.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>
                    {shipping === 0 ? "Free" : `${currency} ${shipping}`}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>
                    {currency} {tax.toFixed(2)}
                  </span>
                </div>
              </div>

              <hr className="my-4" />

              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>
                  {currency} {finalTotal.toFixed(2)}
                </span>
              </div>

              {/* LOGIN-AWARE BUTTON */}
              <button
                onClick={() => {
                  if (!user) {
                    navigate("/login");
                  } else {
                    navigate("/checkout");
                  }
                }}
                className={`w-full mt-4 py-2 rounded font-medium transition-all 
                ${
                  user
                    ? "bg-lime-400 hover:bg-lime-500 text-black"
                    : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                }`}
              >
                {user ? "Proceed to Checkout" : "Please Login First"}
              </button>

              <button
                onClick={clearCart}
                className="w-full mt-3 border py-2 text-sm hover:bg-gray-100 rounded"
              >
                Clear Cart
              </button>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
};

export default Cart;
