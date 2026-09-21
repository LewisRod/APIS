import "dotenv/config"
import express from "express"
import { loggerMiddleware } from "./middlewares/logger.middleware.js"
import authRouter from "./routes/auth.routes.js"

const app = express()

app.use(express.json())
app.use(loggerMiddleware)
app.use(authRouter)

app.listen(3000, ()=> console.log("PUERtO 3000"))