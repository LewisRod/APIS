import express from "express";

import {crearLibro,listarLibros,obtenerLibro,eliminarLibro} from "../controllers/libros.controller.js";

import { authMiddleware } from "../middlewares/auth.middleware.js";


const router = express.Router();

router.post("/", authMiddleware, crearLibro);
router.get("/", authMiddleware, listarLibros);
router.get("/:id", authMiddleware, obtenerLibro);
router.delete("/:id", authMiddleware, eliminarLibro);

export default router;
