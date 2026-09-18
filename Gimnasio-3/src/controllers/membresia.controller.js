import prisma from "../db.js"


export const crearMembresia = async (req, res) => {
    const { tipo, precio} = req.body
    
    const nuevaMembresia = await prisma.membresia.create({
        data: {tipo,precio,activa:true,usuarioId:req.usuario.id}
    })

    return res.status(201).json({mensaje: "Membresia creada", nuevaMembresia})
}

export const listarMembresia = async (req, res) => {
    let membresia

    if (req.usuario.rol === "admin") {
        membresia = await prisma.membresia.findMany()
    }
    else {
        membresia = await prisma.membresia.findMany({
            where:{usuarioId:req.usuario.id}
        })
    }

    return res.json({membresia}) 
}



export const buscarMembresia = async (req, res) => {
    const id = parseInt(req.params.id)
    
    const membresia = await prisma.membresia.findUnique({
        where:{id}
    })

    if (!membresia) {
        return res.status(404).json({mensaje:"NO ENCONTRADA"})
    }

    if (req.usuario.rol === "admin") {
        return res.json(membresia)
    }

    if (req.usuario.id !== membresia.usuarioId) {
        return res.status(403).json({mensjae: "no puedes ver esta membresia"})
    }

    return res.json(membresia)
}