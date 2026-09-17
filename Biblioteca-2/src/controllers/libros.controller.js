import prisma from "../db.js"

export const crearLibro = async (req, res) => {
    const { titulo, autor, publicado } = req.body
    
    const nuevoLibro = await prisma.libro.create({
        data:{titulo,autor,publicado,usuarioId:req.usuario.id}
    })

     return res.status(201).json(nuevoLibro)
}


export const listarLibros = async (req, res) => {
    let libros;

    if (req.usuario.rol === "admin") {
        libros = await prisma.libro.findMany()
    }
    else {
        libros = await prisma.libro.findMany({
            where: {usuarioId: req.usuario.id}
        })
    }

     return res.status(200).json(libros);
}



export const obtenerLibro = async (req, res) => {
    const id = parseInt(req.params.id)

    const encontrarLibro = await prisma.libro.findUnique({
        where: {id}
    })


    if (!encontrarLibro) {
        return res.status(404).json({error: "libro no encontrado"})
    }

    if (req.usuario.rol !== "admin" && encontrarLibro.usuarioId !== req.usuario.id) {
      return res.status(403).json({
        mensaje: "No tienes permiso para ver este libro",
      })
    }

    return res.json(encontrarLibro)
}


export const eliminarLibro = async (req, res) => {
    const id = parseInt(req.params.id)

     const libro = await prisma.libro.findUnique({
       where: {id}
     });

     if (!libro) {
         return res.status(404).json({ mensaje: "Libro no encontrado" })
     }
    
    if (req.usuario.rol !== "admin" && libro.usuarioId !== req.usuario.id) {
      return res.status(403).json({
        mensaje: "No tienes permiso para eliminar este libro"
      })
    }

    await prisma.libro.delete({
      where: {id}
    })


return res.status(200).json({ mensaje: "Libro eliminado correctamente"});

}