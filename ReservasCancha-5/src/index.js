import "dotenv/config"
import express from "express"
import{loggerMiddleware} from "./middlewares/logger.middleware.js"

const app = express()

app.use(express.json())
app.use(loggerMiddleware)

app.listen(3000, () => { console.log("puerto 3000") })
