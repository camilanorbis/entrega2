import express from "express"
import { getUserData } from "../controllers/session.controller.js"

const router = express.Router()

router.get("/current", getUserData)

export default router