import prisma from "../db.js"



export const listarProductos = async (req, res) => {
    const productos = await prisma.productos.findMany()

    res.json(productos)
}


export const buscarPorId = async (req, res) => {
    const id = parseInt(req.params.id)

    const buscarProducto = await prisma.productos.findUnique({
        where: {id}
    })

    if (!buscarPorId) {
        return res.status(404).json({error: "Producno no ta"})
    }

    res.json(buscarPorId)
}


export const buscarPorCategoria = async (req, res) => {
    const buscarProducto = await prisma.productos.findFirst({
        Where: { categoria: "Alimentos"}
    })

     if (!buscarProducto) {
       return res.status(404).json({ error: "Producno no ta" });
     }
    
    res.json(buscarProducto)

}


export const crearProducto = async (req, res) => {
    const { nombre, precio, cantidad, categoria } = req.body
    
    const nuevoProducto = await prisma.productos.create({
        data: {nombre,precio,cantidad,categoria}
    })
    
    res.json(nuevoProducto)

}