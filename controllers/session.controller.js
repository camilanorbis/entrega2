import jwt from "jsonwebtoken"
import UserDTO from "../DTO/UserDTO.js"
import { config } from "../config/config.js"
import { nanoid } from "nanoid"
import { sessionService } from "../service/index.js"
import { createHash } from "../utils/user.utils.js"
import { create } from "express-handlebars"

export const createUser = async (req,res) => {
    return res.status(201).json({ status:'success', payload: req.user })
}

export const getErrorRegister = async (req,res) => {
    res.setHeader('Content-Type','application/json')
    return res.status(400).json({ status:'error', payload:'No se pudo crear usuario, falta información o el usuario ya existe' })
}

export const getErrorLogin = async (req,res) => {
    res.setHeader('Content-Type','application/json')
    return res.status(400).json({ status:'error', payload:'Credenciales inválidas' })
}

export const login = async (req,res) => {
    const user = req.user
    const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, config.JWT_SECRET, { expiresIn: "1h" })

    res.cookie("token", token, { httpOnly: true, secure: false, maxAge: 60 * 60 * 1000 });
    res.setHeader('Content-Type','application/json')
    return res.status(200).json({ status:'success', payload: 'Login correcto' })
}

export const getCurrentUser = async (req,res) => {
    try {
        const userDto = new UserDTO(req.user)
        res.setHeader('Content-Type','application/json')
        return res.status(200).json({ status: 'success', payload: userDto })
    } catch (error) {
        return res.status(500).json({ status:'error', payload:'No fue posible obtener los datos del usuario' })
    }
}

export const forgotPassword = async (req,res) => {
    try {
        const { email } = req.body

        const user = await sessionService.getUserByFilter({ email })
        if (!user) return res.status(404).json({ status:'error', payload: "Usuario no existe" })

        const token = nanoid(10)
        await sessionService.saveResetToken(user._id, token)
       // const resetLink = `http://localhost:${config.PORT}/reset-password/${token}`
        const resetLink = `http://localhost:${config.PORT}/api/sessions/reset-password/${token}`


        await sessionService.sendRecoveryEmail(user.email, resetLink)

        res.status(200).json({ status:'success', payload: "Email enviado" })
    } catch (error) {
        return res.status(500).json({ status:'error', payload:'No fue posible acceder a la recuperación de la contraseña' })
    }
}

export const resetPassword = async (req, res) => {
    try {
        const { token, password, confirmPassword } = req.body

        if (password !== confirmPassword) {
            return res.status(400).json({ status:'error', payload: "Las contraseñas no coinciden" })
        }

        const user = await sessionService.getUserByFilter({
            resetToken: token,
            resetTokenExpires: { $gt: new Date() }
        })

        if (!user) {
            return res.status(400).json({ status:'error', payload: "Token inválido o expirado" })
        }

        const hashedPassword = createHash(password)

        await sessionService.updateUser(
            { _id: user._id },
            { 
                $set: { password: hashedPassword },
                $unset: { resetToken: "", resetTokenExpires: "" }
            }
        )

        res.status(200).json({ status:'success', payload: "Contraseña actualizada correctamente" })

    } catch (error) {
        res.status(500).json({ status:'error', payload: "Error al actualizar contraseña" })
    }
}
