import CartDAO from "../dao/CartDAO.js";
import ProductDAO from "../dao/ProductDAO.js";
import CartService from "./cart.service.js";

export const cartService = new CartService(new CartDAO,new ProductDAO)