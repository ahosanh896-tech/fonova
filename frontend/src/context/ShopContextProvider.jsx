import { useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { ShopContext } from "./ShopContext";

const ShopContextProvider = ({ children }) => {
  const currency = "$";

  const auth = useAuth();
  const { checkAuth } = auth;

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const value = {
    currency,
    ...auth,
  };

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
};

export default ShopContextProvider;
