import Router from "express"
import { crearEvento } from "../controllers/evento.controller.js"
import{authMiddleware} from "../middlewares/auth.middleware.js"


const router = Router()


router.post("/", authMiddleware, crearEvento)

export default router