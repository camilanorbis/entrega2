import CartDAO from "../dao/CartDAO.js";
import ProductDAO from "../dao/ProductDAO.js";
import TicketDAO from "../dao/TicketDAO.js";
import CartService from "./cart.service.js";
import SessionDAO from "../dao/SessionDAO.js"
import SessionService from "./session.service.js";

export const cartService = new CartService(new CartDAO,new ProductDAO, new TicketDAO)
export const sessionService = new SessionService(new SessionDAO)
