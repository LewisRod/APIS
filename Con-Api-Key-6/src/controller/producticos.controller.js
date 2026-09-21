import prisma from "../db.js"



export const crearProductico = async (req, res) => {
    const { nombre, precio, stock } = req.body
    

    const nuevoProducto = await prisma.producto.create({
        data: {nombre,precio,stock}
    })

    return res.json({mensaje:"producto creado",nuevoProducto})
}

export const listarProductico = async (req, res) => {
    const producto = await prisma.producto.findMany()

    return res.json(producto)
}