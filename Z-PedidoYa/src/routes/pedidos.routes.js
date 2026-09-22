import Router from "express"
import { crearPedido,cambiarCantidad,cambiarEstado,listarlos,borrarPedido } from "../controllers/pedidos.controller.js"
import {authMiddleware} from "../middlewares/auth.middleware.js"

const router = Router()

router.post("/", authMiddleware, crearPedido)
router.put("/:id", authMiddleware, cambiarCantidad)
router.put("/:id", authMiddleware, cambiarEstado);
router.get("/", authMiddleware, listarlos)
router.delete("/:id", authMiddleware, borrarPedido)


export default router