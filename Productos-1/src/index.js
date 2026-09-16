import prisma from "./db.js"
import "dotenv/config"
import express from "express"
import { loggerMiddleware } from "./middlewares/loggerMiddleware.js"
import productosRouter from "./router/productosRouter.js"


const app = express()

app.use(express.json())
app.use(loggerMiddleware)
app.use(productosRouter)

app.listen(3000, () => console.log("Servidor en el puerto 3000"))

