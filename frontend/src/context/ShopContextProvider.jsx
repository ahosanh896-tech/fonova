import { useAuth } from "../hooks/useAuth";
import { ShopContext } from "./ShopContext";

const ShopContextProvider = ({ children }) => {
  const currency = "$";
  const auth = useAuth();

  const value = {
    currency,
    ...auth,
  };

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
};

export default ShopContextProvider;
