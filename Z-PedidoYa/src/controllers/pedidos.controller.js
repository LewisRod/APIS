import prisma from "../db.js";

export const crearPedido = async (req, res) => {
    const { producto, cantidad, precio, estado, fecha, clienteId } = req.body
    
    if (cantidad <= 0 || precio <= 0) {
        return res.json({mensaje:"no pueden ser negativos"})
    }

    const fechaa = new Date(fecha).toDateString()

    const nuevoPedido = await prisma.pedido({
        data:{producto,cantidad,precio,estado,fecha:fechaa,clienteId:req.usuario.id}
    })

    return res.json(nuevoPedido)
}


export const cambiarEstado = async (req, res) => {
    const id = parseInt(req.params.id)
    const{estado}= req.body

    const buscarPedido = await prisma.pedido.findUnique({
        where:{id:id}
    })

    if (!buscarPedido) {
        return res.json({mensaje:"no s encuentra pedididto"})
    }

    const actualizarlo = await prisma.pedido.update({
        where: { id: id },
        data:{estado}
    })

    return res.json(actualizarlo)
}




export const cambiarCantidad = async (req, res) => {
  const id = parseInt(req.params.id);
  const { cantidad } = req.body;

  const buscarPedido = await prisma.pedido.findUnique({
    where: { id: id },
  });

  if (!buscarPedido) {
    return res.json({ mensaje: "no s encuentra pedididto" });
  }

  const actualizarlo = await prisma.pedido.update({
    where: { id: id },
    data: { cantidad },
  });

  return res.json(actualizarlo);
};


export const listarlos = async (req, res) => {
    const pedidos = await prisma.pedido.findMany()

    return res.json(pedidos)
}


export const borrarPedido = async (req, res) => {
      const id = parseInt(req.params.id);
     
      const buscarPedido = await prisma.pedido.findUnique({
        where: { id: id },
      });

      if (!buscarPedido) {
        return res.json({ mensaje: "no s encuentra pedididto" });
      }
    
    const borrarlo = await prisma.pedido.delete({
        where:{id:id}
    })

    return res.json({mensaje:"borraedo correctamente",borrarlo})
}
