import passport from "passport"
import local from "passport-local"
import SessionDAO from "../dao/SessionDAO.js"
import CartDAO from "../dao/CartDAO.js"
import { createHash, validaPass } from "../utils/user.utils.js"
import passportJWT from "passport-jwt"


const sessionDao = new SessionDAO()
const cartDao = new CartDAO()

const getToken = req => {
    let token = null

    if (req.cookies.token) {
        token = req.cookies.token
    }

    return token
}

export const passportInit = () => {

    passport.use("registro", new local.Strategy(
        { 
            usernameField: "email", 
            passReqToCallback: true 
        }, 
        async (req, username, password, done) => {
            try {
                const data = req.body
                if (!data.first_name || !data.last_name || !username || !password) {
                    return done(null, false)
                }

                const existe = await sessionDao.getUserByFilter({ email: username })
                if (existe) {
                    return done(null, false)
                }
            
                const cart = await cartDao.createCart()
                const user = {
                    first_name: data.first_name,
                    last_name: data.last_name,
                    email: username,
                    password: createHash(password),
                    age: data.age,
                    cart: cart._id
                }

                const newUser = await sessionDao.createUser(user)
                return done(null, newUser)

            } catch (error) {
                return done(error)
            }
        }
    ))

    passport.use("login", new local.Strategy(
        {
            usernameField: "email" 
        }, 
        async(username, password, done)=>{
            try {
                const user = await sessionDao.getUserByFilter({ email: username })
                if (!user) {
                    return done(null, false)
                }
                
                if (!validaPass(password, user.password)) {
                    return done(null, false)
                }
                
                delete user.password
                return done(null, user)

            } catch (error) {
                return done(error)
            }
        }
    ))
    

    passport.use("current", new passportJWT.Strategy(
        { 
            secretOrKey: process.env.JWT_SECRET, 
            jwtFromRequest: passportJWT.ExtractJwt.fromExtractors([getToken]) 
        }, 
        async(jwt_payload, done)=>{
            try {
                const user = await sessionDao.getUserByFilter({ _id: jwt_payload.id })
                if (!user) return done(null,false)

                return done(null, user)
            } catch (error) {
                return done(error)
            }
        }
    ))

}