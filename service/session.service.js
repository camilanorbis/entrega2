import { transport } from "../config/email.config.js"

export default class SessionService {

    constructor (sessionDao) {
        this.sessionDao = sessionDao
    }

    async getUserByFilter (filter) {
        return this.sessionDao.getUserByFilter(filter)
    }

    async updateUser (filter,update) {
        return this.sessionDao.updateUser(filter,update)
    }

    async saveResetToken (userId, token) {
        const expiration = new Date(Date.now() + 60 * 60 * 1000)

        return await this.sessionDao.updateUser (
            { _id: userId },
            {
            $set: {
                resetToken: token,
                resetTokenExpires: expiration
            }
            }
        )
    }  

    async sendRecoveryEmail (userEmail, resetLink) {
        return await transport.sendMail({
            from: "Camila Norbis <camilanorbis@gmail.com>",
            to: userEmail,
            subject: "Recuperar contraseña",
            html: `
            <h2>Recuperación de contraseña</h2>
            <p>Click en el siguiente enlace:</p>
            <a href="${resetLink}">Cambiar contraseña</a>
            `
        })
    }


}