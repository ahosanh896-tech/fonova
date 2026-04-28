import { useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { ShopContext } from "./ShopContext";
import { useCart } from "../hooks/useCart";

const ShopContextProvider = ({ children }) => {
  const currency = "$";

  const auth = useAuth();
  const cartHook = useCart();

  const { checkAuth } = auth;

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const value = {
    currency,
    ...auth,
    ...cartHook,
  };

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
};

export default ShopContextProvider;
