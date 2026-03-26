import express from "express";
import upload from "../middleware/multer.js";
import userAuth from "../middleware/userAuth.js";
import isAdmin from "../middleware/isAdmin.js";

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
  deleteReview,
} from "../controller/productController.js";

const productRouter = express.Router();

productRouter.post(
  "/",
  userAuth,
  isAdmin,
  upload.array("images", 4),
  addProduct,
);

productRouter.put(
  "/:id",
  userAuth,
  isAdmin,
  upload.array("images", 4),
  updateProduct,
);

productRouter.delete("/:id", userAuth, isAdmin, deleteProduct);

productRouter.put("/restore/:id", userAuth, isAdmin, restoreProduct);

productRouter.get("/", getProducts);
productRouter.get("/bestsellers", getBestsellerProducts);
productRouter.get("/slug/:slug", getSingleProduct);

productRouter.post("/review/:id", userAuth, addReview);
productRouter.put("/review/:id", userAuth, updateReview);
productRouter.delete("/review/:id", userAuth, deleteReview);

export default productRouter;
