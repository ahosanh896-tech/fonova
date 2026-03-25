import express from "express";
import upload from "../middleware/multer.js";

import { addProduct, getProducts } from "../controller/productController.js";

const productRouter = express.Router();

productRouter.post("/add", upload.array("images", 4), addProduct);

productRouter.get("/", getProducts);

export default productRouter;
