import express from "express";
import upload from "../middleware/multer.js";

import {
  addProduct,
  deleteProduct,
  getProducts,
  getSingleProduct,
  updateProduct,
} from "../controller/productController.js";

const productRouter = express.Router();

productRouter.post("/add", upload.array("images", 4), addProduct);

productRouter.get("/", getProducts);

productRouter.get("/:slug", getSingleProduct);

productRouter.put("/:id", upload.array("images", 4), updateProduct);

productRouter.delete("/:id", deleteProduct);

export default productRouter;
