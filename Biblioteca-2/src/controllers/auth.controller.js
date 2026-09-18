import prisma from "../db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  const { nombre, email, password } = req.body;

  const usuarioExistente = await prisma.usuario.findUnique({
    where: {
      email,
    },
  });

  if (usuarioExistente) {
    return res.status(400).json({ mensaje: "usuario registrado" });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const usuario = await prisma.usuario.create({
    data: { nombre, email, password: passwordHash },
  });

  return res.status(201).json({
    mensaje: "usuario registrado correctamente",
    usuario: {
      id: usuario.id,
      nombre: usuario.nombre,
      email: usuario.email,
      rol: usuario.rol,
    },
  });
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  const usuario = await prisma.libro.findUnique({
    where: { email },
  });

  if (!usuario) {
    return res.status(401).json({ mensaje: "credenciales incorrectas" });
  }

  const passwordCorrecta = await bcrypt.compare(password, usuario.password);

  if (!passwordCorrecta) {
    return res.status(401).json({ error: "credenciales incorrectas" });
  }

  const token = jwt.sign(
    { id: usuario.id, rol: usuario.rol },
    process.env.JWT_SECRET,
    { expiresIn: "20h" },
  );

  return res.status(200).json({ mensaje: "iniciado correctamente", token });
};

