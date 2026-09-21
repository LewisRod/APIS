import Router from "express"
import { apiKeyMiddleware } from '../middlewares/apiKey.middleware.js';
import { crearProductico,listarProductico } from "../controller/producticos.controller.js";


const router = Router()

router.post("/", apiKeyMiddleware, crearProductico)
router.get("/",apiKeyMiddleware,listarProductico)

export default router