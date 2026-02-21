import jwt from "jsonwebtoken"
import UserDTO from "../DTO/UserDTO.js"

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
    const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" })

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