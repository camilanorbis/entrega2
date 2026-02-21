import express from "express"
import { getProducts, getProductById, createProduct, modifyProduct, deleteProduct } from "../controllers/product.controller.js";
import { passportCurrent, authorizeRole } from "../middleware/auth.js";

const router = express.Router();

router.get("/", getProducts)

router.get("/:pid", getProductById)

router.post("/", passportCurrent, authorizeRole("admin"), createProduct)

router.put("/:pid", passportCurrent, authorizeRole("admin"), modifyProduct)

router.delete("/:pid", passportCurrent, authorizeRole("admin"), deleteProduct)

export default router