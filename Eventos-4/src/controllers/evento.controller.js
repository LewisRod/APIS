import prisma from "../db.js";

export const crearEvento = async (req, res) => {
  const { nombre, descripcion, precio, capacidad, fecha } = req.body;

  if (!nombre || !descripcion || !precio || !capacidad || !fecha) {
    return res.status(400).json({ mensjae: "faltan datos" });
  }

  if (capacidad <= 0 || precio <= 0) {
    return res
      .status(400)
      .json({ mensjae: "el precio y capacidad no pueden ser negativos" });
  }

  if (req.usuario.rol !== "organizador") {
    return res.status(403).json({
      mensaje: "Solo los organizadores pueden crear eventos",
    });
  }

  const fechaEvento = new Date(fecha);
  const nuevoEvento = await prisma.evento.create({
    data: {
      nombre,
      descripcion,
      precio,
      capacidad,
      fecha: fechaEvento,
      organizadorId: req.usuario.id,
    },
  });

  return res.json(nuevoEvento);
};



export const listarEvento = async (req, res) => {
  let evento;

  evento = await prisma.evento.findMany();

  return res.json(evento);
};


export const buscarEvento = async (req, res) => {
    let evento 

    if (req.usuario.rol != "organizador") {
        return res.status(403).json({mensaje:"solo los organizadores tienen acceso a ver  eventos"})
    }
    else {
        evento = await prisma.evento.findUnique({
           where:{id} 
        })
    }

    return res.json(evento)
}


export const inscribirseAEvento = async (req, res) => {
    
}