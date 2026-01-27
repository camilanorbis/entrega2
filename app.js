import express from "express"
import ProductManager from "./dao/ProductManager.js"
import CartManager from "./dao/CartManager.js"
import productRouter from "./routes/product.route.js"
import cartRouter from "./routes/cart.route.js"
import rootRouter from "./routes/root.route.js"
import sessionRouter from "./routes/session.route.js"
import userRouter from "./routes/user.route.js"
import { Server } from "socket.io"
import http from "http"
import handlebars from "express-handlebars"
import { connectDB } from "./config/db.js"

//server definition
const app = express();
const servidor = http.createServer(app);
const PORT = 8080;

//Servidor websockets -> responde solicitudes que vengan de ws://localhost:8080
const servidorWS = new Server(servidor);
servidorWS.on("connection", (socket) => {
    console.log("nuevo cliente conectado")

    socket.emit("respuesta", "Hola desde el servidor")
})

//server configuration
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
const basePathProducts = "/api/products"
const basePathCarts = "/api/carts"
const basePathSessions = "/api/sessions"
const basePathUser = "/api/user"

//handlebars
app.engine('handlebars',handlebars.engine())
app.set('view engine','handlebars')
app.use(express.static("public"))


async function init() {
    //const productManager = await new ProductManager('products.json').init();
    //const cartManager = await new CartManager('carts.json').init();

    //app.locals.productManager = productManager;
    //app.locals.cartManager = cartManager;

    app.use("/",rootRouter)
    app.use(basePathProducts,productRouter)
    app.use(basePathCarts,cartRouter)
    app.use(basePathSessions,sessionRouter)
    app.use(basePathUser,userRouter)

    app.locals.servidorWS = servidorWS;

    servidor.listen(PORT, () => {
        console.log(`Serivdor iniciado en el puerto ${PORT}`)
    })

    connectDB("mongodb+srv://root:root@cluster0.awnmodg.mongodb.net/?appName=Cluster0","entrega_db")

}

init().catch(error => {
    console.error("Error inicializando managers:", error);
    process.exit(1);
});