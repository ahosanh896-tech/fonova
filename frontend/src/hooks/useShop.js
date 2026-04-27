import { useContext } from "react";
import { ShopContext } from "../context/ShopContext";

export const useShop = () => useContext(ShopContext);
