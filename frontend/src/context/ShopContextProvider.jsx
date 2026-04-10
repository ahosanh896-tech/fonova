import { ShopContext } from "./ShopContext";

const ShopContextProvider = ({ children }) => {
  const currency = "$";

  const value = {
    currency,
  };

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
};

export default ShopContextProvider;
