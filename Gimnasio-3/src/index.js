import "dotenv/config"
import express from "express"
import { loggerMiddleware } from './middlewares/logger.middleware.js';
import authRouter from "./routes/auth.routes.js"
import membresiaRouter from "./routes/membresia.routes.js"

const app = express()

app.use(express.json())
app.use(loggerMiddleware)
app.use("/auth", authRouter)
app.use("/membresia",membresiaRouter)

app.listen(3000, () => console.log("Puerto 3000 klk"))