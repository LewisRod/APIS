import "dotenv/config";
import express from "express";
import { loggerMiddleware } from "./middlewares/loggerMiddleware.js";
import routerController from "./routes/producto.routes.js"

const app = express();

app.use(express.json());
app.use(loggerMiddleware)
app.use("/producticos",routerController)

app.listen(3000, () => {
  console.log("puerto 3000");
});