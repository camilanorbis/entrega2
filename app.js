import express from "express"
import productRouter from "./routes/product.route.js"
import cartRouter from "./routes/cart.route.js"
import rootRouter from "./routes/root.route.js"
import sessionRouter from "./routes/session.route.js"
import { Server } from "socket.io"
import http from "http"
import handlebars from "express-handlebars"
import { connectDB } from "./config/db.js"
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import passport from "passport";
import { passportInit } from "./config/config.passport.js";

//TODO mover a config
dotenv.config();

//server definition
const app = express();
const servidor = http.createServer(app);
const PORT = process.env.PORT;

//Servidor websockets -> responde solicitudes que vengan de ws://localhost:8080
const servidorWS = new Server(servidor);
servidorWS.on("connection", (socket) => {
    console.log("nuevo cliente conectado")

    socket.emit("respuesta", "Hola desde el servidor")
})

//configuration
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser());
passportInit();
app.use(passport.initialize());
const basePathProducts = "/api/products"
const basePathCarts = "/api/carts"
const basePathSessions = "/api/sessions"

//handlebars
app.engine('handlebars',handlebars.engine())
app.set('view engine','handlebars')
app.use(express.static("public"))


async function init() {
    app.use("/",rootRouter)
    app.use(basePathProducts,productRouter)
    app.use(basePathCarts,cartRouter)
    app.use(basePathSessions,sessionRouter)

    app.use((error, req, res, next) => {
        res.status(500).json({ status: 'error', payload: error.message || 'Error interno del servidor' })
    })


    app.locals.servidorWS = servidorWS;

    servidor.listen(PORT, () => {
        console.log(`Serivdor iniciado en el puerto ${PORT}`)
    })

    connectDB(process.env.MONGO_URL,process.env.DB_NAME)

}

init().catch(error => {
    console.error("Error inicializando managers:", error);
    process.exit(1);
});