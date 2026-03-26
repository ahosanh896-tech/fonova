import express from "express";
import upload from "../middleware/multer.js";
import userAuth from "../middleware/userAuth.js";

import {
  addProduct,
  deleteProduct,
  getBestsellerProducts,
  getProducts,
  getSingleProduct,
  restoreProduct,
  updateProduct,
  addReview,
  updateReview,
} from "../controller/productController.js";

const productRouter = express.Router();

productRouter.post("/add", upload.array("images", 4), addProduct);

productRouter.get("/", getProducts);
productRouter.get("/bestsellers", getBestsellerProducts);
productRouter.get("/slug/:slug", getSingleProduct);

productRouter.put("/update/:id", upload.array("images", 4), updateProduct);

productRouter.delete("/delete/:id", deleteProduct);

productRouter.put("/restore/:id", restoreProduct);

productRouter.post("/review/:id", userAuth, addReview);
productRouter.put("/review/:id", userAuth, updateReview);
export default productRouter;
