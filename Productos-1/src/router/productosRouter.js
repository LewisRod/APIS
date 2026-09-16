import express from "express"
import { listarProductos, buscarPorId, buscarPorCategoria, crearProducto } from "../controller/productosController.js"
import Router from "express"


const router = Router()

router.get("/productos", listarProductos)
router.get("/productos/:id", buscarPorId)
router.get("productos/categoria", buscarPorCategoria)
router.post("/productos", crearProducto)

export default router
