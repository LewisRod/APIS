import prisma from "../db.js"

export const crearReserva = async (req, res) => {
    const { sala, fecha, horaInicio, horaFin } = req.body
    
    if (!sala || !fecha || !horaInicio || !horaFin) {
        return res.status(403).json({mensaje:"faltan campos por llenar"})
    }

    if (typeof sala != "string" || typeof horaInicio != "number" || horaFin != "number") {
        return res.status(403).json({mensjae:"sala es un string y las horas son numeros"})
    }

    const nuevaReserva = await prisma.reserva.create({
        data:{sala,fecha,horaFin,horaInicio,duracion:horaFin-horaInicio,costo:req.reserva.duracion * 200}
    })

    return res.json(nuevaReserva)
}

