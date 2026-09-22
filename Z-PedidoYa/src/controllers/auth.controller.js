import prisma from "../db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


export const registrar = async (req, res) => {
    const { nombre, email, password, rol } = req.body 
    
    if (!nombre || !email || !password) {
        return res.status(403).json({mensaje:"faltan dato"})
    }

    const usuario = await prisma.usuario.findUnique({
        where:{email}
    })

    if (usuario) {
        return res.json({mensaje:"usuario ya creado"})
    }

    const passwordHash = await bcrypt.hash(password, 10)
    
    const nuevoUsuario = await prisma.usuario.create({
        data:{nombre,email,password:passwordHash,rol}
    })

    return res.status(201).json({mensaje:"usuario creado correctamente",nuevoUsuario})
}


export const login = async (req, res) => {
    const { email, password } = req.body
    
    const usuario = await prisma.usuario.findUnique({
        where:{email}
    })

    if (!usuario) {
         return res.json({ mensaje: "usuario no creado" });
    }

    const passwordCorrecta = await bcrypt.compare(password, usuario.password)
    
        if (!passwordCorrecta) {
          return res.json({ mensaje: "contrasena incorrecta" });
        }
    
    const token = jwt.sign(
        { id: usuario.id, rol: usuario.rol },
        process.env.JWT_SECRET,
        {expiresIn:"24h"}
    )


    return res.json({mensaje:"inicio sesion corrcto", token})
}


