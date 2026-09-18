import Router from "express"
import { crearMembresia,listarMembresia,buscarMembresia } from "../controllers/membresia.controller.js"
import {authMiddleware} from "../middlewares/auth.middleware.js"

const router = Router()

router.post("/", authMiddleware, crearMembresia)
router.get("/", authMiddleware, listarMembresia)
router.get("/:id",authMiddleware,buscarMembresia)

export default router