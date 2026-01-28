import express from "express"
import { createUser, login, getCurrentUser, getErrorRegister, getErrorLogin } from "../controllers/session.controller.js"
import passport from 'passport';
import { passportCurrent } from "../middleware/auth.js";

const router = express.Router()

router.post("/register", passport.authenticate("registro", {session: false, failureRedirect: "/api/sessions/error_register"}), createUser)

router.get("/error_register", getErrorRegister)

router.get("/error_login", getErrorLogin)

router.post("/login", passport.authenticate("login", {session: false, failureRedirect: "/api/sessions/error_login"}), login)

router.get("/current", passportCurrent, getCurrentUser)

export default router 