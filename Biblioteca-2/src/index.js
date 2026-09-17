import "dotenv/config"
import express from "express"
import { loggerMiddleware } from "./middlewares/logger.middleware.js"
import authRoutes from "./routes/auth.routes.js";
import librosRoutes from "./routes/libros.routes.js"


const app = express()
 

app.use(express.json())
app.use(loggerMiddleware)
app.use("/auth", authRoutes)
app.use("/libros",librosRoutes)


app.listen(3000, () => {
    console.log("Puerto 3000")
})
