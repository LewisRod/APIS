import prisma from "../db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


export const register = async (req, res) => {
    const { nombre, email, password,rol} = req.body
    
    const usuario = await prisma.usuario.findUnique({
        where: {email}
    })

    if (usuario) {
        return res.status(401).json({mensaje: "Usuario ya existente"})
    }

    const passwordHash = await bcrypt.hash(password, 10)
    
    const nuevoUsuario = await prisma.usuario.create({
        data: {nombre,email,password:passwordHash,rol}
    })

    //ojo aqui
    return res.json({usuario: nuevoUsuario})
}



export const login = async (req, res) => {
    const { email, password } = req.body
    
    const usuario = await prisma.usuario.findUnique({
        where:{email}
    })

    if (!usuario) {
        return res.status(401).json({ mensaje: "credenciales incorrectas" })
    }

    const passwordCorrecta = await bcrypt.compare(password, usuario.password)
    
    if (!passwordCorrecta) {
        return res.status(401).json({ mensaje: "contraseña incorrectas" });
    }

    const token = jwt.sign(
        { id: usuario.id, rol: usuario.rol },
        process.env.JWT_SECRET,
        {expiresIn: "20h"}
    )

    return res.json({mensaje: "inicio sesion correcto",token})
}