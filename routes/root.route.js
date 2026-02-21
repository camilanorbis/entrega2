import express from "express"
import { getRealTimeProducts } from "../controllers/root.controller.js";

const router = express.Router();

//router.get("/", rootHandler)

router.get("/realtimeproducts", getRealTimeProducts)

export default router;