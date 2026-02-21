import express from "express"
import { addProductToCart, createCart, getCartProducts, deleteProductFromCart, updateCartProducts, updateProductQuantity, deleteProductsFromCart } from "../controllers/cart.controller.js";
import { passportCurrent, authorizeCartOwner } from "../middleware/auth.js";

const router = express.Router();

router.post("/", createCart)

router.get("/:cid", getCartProducts)

router.post("/:cid/product/:pid", passportCurrent, authorizeCartOwner, addProductToCart)

router.delete("/:cid/product/:pid", deleteProductFromCart)

router.put("/:cid", updateCartProducts)

router.put("/:cid/product/:pid", updateProductQuantity)

router.delete("/:cid", deleteProductsFromCart)

export default router