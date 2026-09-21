import prisma from "../db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


export const register = async (req, res) => {
    const { nombre, email, password, rol } = req.body
    
    if (!nombre || !email || !password || !rol) {
        return res.status(404).json({mensaje:"faltan datos"})
    }

    if (typeof nombre != "string" || typeof email != "string" || typeof password != "string" || typeof rol != "string") {
        return res.status(404).json({mensaje:"nombre,email,password y rol son campos string"})
    }

    const usuario = await prisma.usuario.findUnique({
        where:{email}
    })

    if (usuario) {
        return res.status(403).json({mensaje:"usuario ya registrado"})
    }

    const passwordHash = await bcrypt.hash(password,10)

    const nuevoUsuario = await prisma.usuario.create({
        data: {nombre,email,password,rol}
    })

    return res.json({mensaje:"usuario creado correctamente", nuevoUsuario})
}


export const login = async (req, res) => {
    const { email, password } = req.body
    
    if (!email || !password) {
      return res.status(404).json({ mensaje: "faltan datos(verifica. haber puesto email y contrasena)" });
    }

    if ( typeof email != "string" || typeof password != "string" ) {
      return res.status(404).json({ mensaje: "nombre,email,password y rol son campos string" });
    }

      const usuario = await prisma.usuario.findUnique({
        where: { email }
      });

      if (!usuario) {
        return res.status(403).json({ mensaje: "usuario no encontrado" });
      }
    
    const contrasenaCorrecta = await bcrypt.compare(password,usuario.password)

    if (!contrasenaCorrecta) {
        return res.json({mensaje:"contrasena incorrecta"})
    }

    const token = jwt.sign(
        { id: usuario.id, rol: usuario.rol },
        process.env.JWT_SECRET,
        {expiresIn:"24h"}
    )

    return res.status(201).json({mensjae:"Inicio sesion correcto",token})

}