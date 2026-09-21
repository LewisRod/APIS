const express = require("express");
const prisma = require("./db");

const app = express();

app.use(express.json());

app.get("/productos", async (req, res) => {
  try {
    const productos = await prisma.producto.findMany();

    res.json(productos);
  } catch (error) {
    res.status(500).json({
      error: "Error al obtener los productos",
    });
  }
});

app.post("/productos", async (req, res) => {
    const { nombre, categoria, precio, stock } = req.body
    
    const nuevoProducto = await prisma.producto.create({
        data: {nombre,categoria,precio,stock}
    })

   return res.json(nuevoProducto)
})

app.update("/productos/:id", async (req, res) => {
    const id = parseInt(req.params.id)

     const { nombre, categoria, precio, stock } = req.body;

    const buscarProducto = await prisma.producto.update({
        where: { id:id},
        data:{nombre,categoria,precio,stock}
    })

    return res.json(buscarProducto)
})

app.get("/productos/estadistica", async (req, res) => {
    const productosEstadisticas = await prisma.producto.aggregate({
      _sum: {
        precio: true,
      },
      _avg: {
        precio: true,
      },

      _min: {
        precio: true,
      },

      _max: {
        precio: true,
      }
    });

    return res.json(productosEstadisticas)
})




app.listen(3000, () => {
  console.log("Servidor ejecutándose en http://localhost:3000");
});



