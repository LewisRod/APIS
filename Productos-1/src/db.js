import { PrismaPg } from "@prisma/adapter-pg" //adaptador de prisma para postgreSQL
//adapta los datos entre uno y otro para que puedan comunicarse.
import { PrismaClient } from "@prisma/client" //prisma client es el que se encarga de
//comunicar los metodos del controller con la BD

const adapter = new PrismaPg({ //constante que guarda el adaptador
    connectionString: process.env.DATABASE_URL //conexion con la BD
})

const prisma = new PrismaClient({ //se crea instancia de prismaClient
    adapter                       //para que tenga el adaptador
})

export default prisma