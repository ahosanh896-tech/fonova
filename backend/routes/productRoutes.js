import express from "express";
import upload from "../middleware/multer.js";

import { addProduct } from "../controller/productController.js";

const productRouter = express.Router();

productRouter.post("/add", upload.array("images", 4), addProduct);

export default productRouter;
