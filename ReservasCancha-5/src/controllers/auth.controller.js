import prisma from "../db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


export const registrar = async (req, res) => {
    const { nombre, email, password, rol } = req.body
    
    const usuarioExistente = await prisma.usuario.findUnique({
        where:{email}
    })

    if (usuarioExistente) {
        return res.status(403).json({mensaje:"usuario registrado anteriormente"})
    }

    const passwordHash = await bcrypt.hash(password,10)

    const nuevoUsuario = await prisma.usuario.create({
        data:{nombre,email,password:passwordHash,rol}
    })

    return res.json({mensaje:"usuario creado correctamente",nuevoUsuario})

}



export const login = async (req, res) => {
    const { email, password } = req.body
    
    const usuario = await prisma.usuario.findUnique({
       where:{email}
    }) 
    
    if (!usuario) {
       return res.status(403).json({ mensaje: "email incorrecto" }); 
    }

    const passwordCorrecta = await bcrypt.compare(password, usuario.password)
    
    if (!passwordCorrecta) {
        return res.status(403).json({ mensaje: "contrasena incorrecto" }); 
    }

    const token = jwt.sign(
        { id: usuario.id, rol: usuario.rol },
        process.env.JWT_SECRET,
        {expiresIn:"20h"}
    )

    return res.status(201).json({mensaje:"logueado correctamente",token})
}
