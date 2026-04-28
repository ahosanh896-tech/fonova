import { useCallback, useEffect, useMemo, useState } from "react";
import {
  getCartApi,
  addToCartApi,
  updateCartApi,
  removeFromCartApi,
  clearCartApi,
} from "../api/cartApi";
import { errorToast, successToast } from "../Toast";

export const useCart = () => {
  const [loading, setLoading] = useState(false);
  const [cart, setCart] = useState([]);

  // CENTRAL ERROR HANDLER
  const handleError = (error) => {
    const errData = error.response?.data;
    errorToast(errData?.message || error.message);
    return errData;
  };

  // GET CART (INITIAL LOAD)
  const fetchCart = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getCartApi();

      if (data.success) {
        setCart(data.cart || []);
      }

      return data;
    } catch (error) {
      return handleError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  // ADD TO CART (Optimistic)
  const addToCart = useCallback(
    async (product, quantity = 1) => {
      const prevCart = [...cart];

      // optimistic update
      setCart((prev) => {
        const existing = prev.find(
          (item) => item.productId._id === product._id,
        );

        if (existing) {
          return prev.map((item) =>
            item.productId._id === product._id
              ? { ...item, quantity: item.quantity + quantity }
              : item,
          );
        }

        return [...prev, { productId: product, quantity }];
      });

      try {
        const data = await addToCartApi({
          productId: product._id,
          quantity,
        });

        if (data.success) {
          successToast(data.message || `${product.name} added to cart`);
        } else {
          setCart(prevCart); // rollback
          errorToast(data.message);
        }

        return data;
      } catch (error) {
        setCart(prevCart);
        return handleError(error);
      }
    },
    [cart],
  );

  // UPDATE CART (No success toast → avoid spam)
  const updateCart = useCallback(
    async (productId, quantity) => {
      const prevCart = [...cart];

      if (quantity <= 0) {
        return removeFromCart(productId);
      }

      // optimistic update
      setCart((prev) =>
        prev.map((item) =>
          item.productId._id === productId ? { ...item, quantity } : item,
        ),
      );

      try {
        const data = await updateCartApi({ productId, quantity });

        if (!data.success) {
          setCart(prevCart);
          errorToast(data.message);
        }

        return data;
      } catch (error) {
        setCart(prevCart);
        return handleError(error);
      }
    },
    [cart],
  );

  // REMOVE FROM CART
  const removeFromCart = useCallback(
    async (productId) => {
      const prevCart = [...cart];

      setCart((prev) =>
        prev.filter((item) => item.productId._id !== productId),
      );

      try {
        const data = await removeFromCartApi(productId);

        if (data.success) {
          successToast("Item removed from cart");
        } else {
          setCart(prevCart);
          errorToast(data.message);
        }

        return data;
      } catch (error) {
        setCart(prevCart);
        return handleError(error);
      }
    },
    [cart],
  );

  // CLEAR CART
  const clearCart = useCallback(async () => {
    const prevCart = [...cart];
    setCart([]);

    try {
      const data = await clearCartApi();

      if (data.success) {
        successToast("Cart cleared");
      } else {
        setCart(prevCart);
        errorToast(data.message);
      }

      return data;
    } catch (error) {
      setCart(prevCart);
      return handleError(error);
    }
  }, [cart]);

  // TOTAL (optimized)
  const total = useMemo(() => {
    return cart.reduce(
      (acc, item) => acc + item.productId.price * item.quantity,
      0,
    );
  }, [cart]);

  const cartCount = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.quantity, 0);
  }, [cart]);

  // INITIAL FETCH
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  return {
    cart,
    loading,
    total,
    fetchCart,
    addToCart,
    updateCart,
    removeFromCart,
    clearCart,
    cartCount,
  };
};
