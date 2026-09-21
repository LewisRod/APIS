import prisma from "../db.js"


export const crearCancha = async (req, res) => {
    const { nombre, deporte, precioHora, disponible, horasReservadas } = req.body
    
    if (req.usuario.rol != "encargado") {
        return res.status(403).json({mensaje:"solo los encargados crean canchas"})
    }
    if (typeof nombre != "string" || typeof deporte != "string" || typeof precioHora != "number" || typeof disponible != "boolean" || typeof horasReservadas != "number") {
        return res.status(403).json({mensaje:"nombre,deporte tienen que ir en string,preciohora y horasReservadas en int y disponible en boolean "})
    }

    if (precioHora <= 0) {
        return res.status(403).json({mensjae:"precio no puede ser menor de 1"})
    }

    const nuevaReserva = await prisma.cancha.create({
      data: {
        nombre,
        deporte,
        precioHora,
        disponible: true,
        horasReservadas: 0,
        encargadoId: req.usuario.id,
      },
    });

    return res.json(nuevaReserva)
}


export const reservarHora = async (req, res) => {
    const id = parseInt(req.params.id)


    const buscarCancha = await prisma.cancha.findUnique({
        where:{id:id}
    })

    if (!buscarCancha) {
        return res.status(404).json({mensaje:"cancha no encontrada"})
    }
    if (buscarCancha.disponible != true) {
         return res.status(403).json({mensjae:"cancha no disponible"})
    }

    const reservar = await prisma.cancha.update({
        where: { id: id },
        data:{horasReservadas:buscarCancha.horasReservadas+1,disponible:false}
        
    })

    return res.json(reservar)
    
}


export const cancelarReserva = async (req, res) => {
    const id = parseInt(req.params.id)

    const buscarCancha = await prisma.cancha.findUnique({
        where:{id:id}
    })

    if (!buscarCancha) {
      return res.status(404).json({ mensaje: "cancha no encontrada" });
    }
    if (buscarCancha.disponible === true && buscarCancha.horasReservadas < 1) {
       return res.status(404).json({ mensaje: "cancha sin reservacion" });
    }

    const cancelar = await prisma.cancha.update({
      where: { id: id },
      data: {
        disponible: true,
        horasReservadas: buscarCancha.horasReservadas - 1,
      },
    });

    return res.json(cancelar);
};

export const actualizarCancha = async (req, res) => {
    const id = parseInt(req.params.id)
    const { nombre, deporte, precioHora, disponible, horasReservadas } = req.body

    const buscarCancha = await prisma.cancha.findUnique({
        where:{id:id}
    })

    if (req.usuario.id !== buscarCancha.encargadoId) {
      return res.status(403).json({
        mensaje: "No puedes modificar una cancha que no es tuya",
      });
    }

    if (!buscarCancha) {
        return res.status(404).json({mensaje:"no faound"})
    }

    if (buscarCancha.disponible === false) {
        return res.status(403).json({mensjae: "no puedes actualizar hay reservacion actualmente"})
    }

    const actualizar = await prisma.cancha.update({
        where: { id: id },
        data:{nombre,deporte,precioHora,disponible:true,horasReservadas:0}
    })

    return res.json(actualizar)
}


const listarCancha = async (req, res) => {
    const cancha = await prisma.cancha.findMany()

    return res.json(cancha)
}


const canchaEstadistica = async (req, res) => {
    const id = parseInt(req.params.id)

    const buscarCancha = await prisma.cancha.findUnique({
        where: { id: id }
    })

    if (!buscarCancha) {
        return res.json({mensaje: "no encontrada"});
    }

    const estadisticas = await prisma.cancha.aggregate({
      where: { id: id },
      _sum: {
        precioHora: true,
      },
      _avg: {
        precioHora: true,
      },
    });

    return res.json(estadisticas)
}


export const eliminarCancha = async (req, res) => {
    const id = parseInt(req.params.id)

    const buscarCancha = await prisma.cancha.findUnique({
        where:{id:id}
    })

    if (!buscarCancha) {
      return res.status(404).json({mensaje:"no esta esa cancha"})
    }

    const eliminar = await prisma.cancha.delete({
        where:{id:id}
    })

    return res.json(eliminar);
}





