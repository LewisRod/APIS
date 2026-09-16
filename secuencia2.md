# APIs --- Secuencia definitiva del proyecto

> Plantilla de referencia para los ejercicios de Programación Aplicada
> II con **Node.js + Express + Prisma 7 + PostgreSQL/Neon + railway**.

------------------------------------------------------------------------

# ⚡ Regla importante: cambios en `schema.prisma`

Si editas un `model` en `schema.prisma`, debes crear una nueva
migración:

``` bash
npx prisma migrate dev --name agregar-votos
```


# ⚡ Para desplegar api

--Variables de entorno
--root directori: nombre exacto de la carpeta del repositorio
--npm build dev


------------------------------------------------------------------------

# PASO 1 --- Crear proyecto Node

``` bash
mkdir ejercicio1
cd ejercicio1
npm init -y
```

Configurar `package.json`:

``` json
{
  "type": "module",
  "scripts": {
    "start": "node src/index.js",
    "build": "prisma generate",
    "dev": "nodemon src/index.js"
  }
}
```

------------------------------------------------------------------------

# PASO 2 — Instalar dependencias

Dependencias principales:

```bash
npm install express @prisma/client@7.10 @prisma/adapter-pg pg dotenv jsonwebtoken bcryptjs
```

Dependencias de desarrollo:

```bash
npm install -D prisma@7.10 nodemon
```


Para asegurar Prisma 7.10:

``` bash
npm uninstall prisma @prisma/client
npm install prisma@7.10 @prisma/client@7.10
```

------------------------------------------------------------------------

# PASO 3 --- Neon + `.env` + `.gitignore`

Crear el proyecto PostgreSQL en Neon.

## `.env`

```env
DATABASE_URL="tu_connection_string"
JWT_SECRET="tu_secreto"
PORT=3000
```

## `.gitignore`

``` text
.env
node_modules/
```

⚠️ Nunca subir `.env` al repositorio.

------------------------------------------------------------------------

# PASO 4 --- Inicializar Prisma

``` bash
npx prisma init
```

Configurar `prisma.config.ts`:

``` ts
import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",

  migrations: {
    path: "prisma/migrations",
  },

  datasource: {
    url: env("DATABASE_URL"),
  },
});
```

------------------------------------------------------------------------
# PASO 4.5 — Generar `JWT_SECRET` y `API_KEY`

Para generar el secreto JWT:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Copiar el resultado al `.env`:

```env
JWT_SECRET=resultado_generado
```
------------------------------------------------------------------------
# PASO 5 --- Configurar `schema.prisma`

Configuración base:

``` prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
}

model Producto {
  id       Int @id @default(autoincrement())
  nombre   String
  precio   Int
  cantidad Int
}
```

El `model` se adapta a cada proyecto.

### Regla

**No agregar `output`.**

------------------------------------------------------------------------

# PASO 6 --- Generar Prisma Client

``` bash
npx prisma generate
```

Resultado esperado:

``` text
✔ Generated Prisma Client (v7.10.0) to ./node_modules/@prisma/client
```

------------------------------------------------------------------------

# PASO 7 --- Migrar la base de datos

``` bash
npx prisma migrate dev --name init
```

------------------------------------------------------------------------

# PASO 8 --- Crear estructura `src`

``` text
src/
├── controllers/
├── middlewares/
├── routes/
├── db.js
└── index.js
```

------------------------------------------------------------------------

# PASO 9 --- Configurar `db.js`

``` js
import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient } from "@prisma/client"

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL
})

const prisma = new PrismaClient({
  adapter
})

export default prisma
```

Como utilizamos:

``` js
export default prisma
```

Los controllers importan:

``` js
import prisma from "../db.js"
```

### ❌ No utilizar

``` js
import { prisma } from "../db.js"
```

porque eso corresponde a un **named export**, no a un `default export`.

------------------------------------------------------------------------

# PASO 10 --- Configurar `index.js`

``` js
import "dotenv/config"
import express from "express"

const app = express()

app.use(express.json())

app.listen(3000, () => {
  console.log("Servidor ejecutándose en el puerto 3000")
})
```

Probar:

``` bash
npm run dev
```

Debe aparecer:

``` text
Servidor ejecutándose en el puerto 3000
```

------------------------------------------------------------------------

# PASO 11 --- Crear Middlewares

Crear:

``` text
src/middlewares/
├── logger.middleware.js
└── validaciones.middleware.js
└── auth.middleware.js
```

Ejemplo de `logger.middleware.js`:

``` js
export const loggerMiddleware = (req, res, next) => {
  console.log(
    `[${new Date().toISOString()}] ${req.method} ${req.url}`
  )

  next()
}
```

En `index.js`:

``` js
import { loggerMiddleware } from "./middlewares/logger.middleware.js"

app.use(loggerMiddleware)
```

## Regla de `export` / `import`

### Named export

``` js
export const loggerMiddleware = ...
```

Se importa:

``` js
import { loggerMiddleware } from "./middlewares/logger.middleware.js"
```

### Default export

``` js
export default loggerMiddleware
```

Se importa:

``` js
import loggerMiddleware from "./middlewares/logger.middleware.js"
```

### 🚨 Regla

No mezclar las dos formas.

------------------------------------------------------------------------


# PASO 12.5 — Autenticación con JWT

La API puede utilizar JWT para autenticar usuarios y proteger endpoints.

## Dependencias

```bash
npm install jsonwebtoken bcryptjs
```

- `jsonwebtoken` → crear y verificar JWT.
- `bcryptjs` → generar y comparar hashes de contraseñas.

## Flujo de autenticación

```text
Registro
   ↓
Hash de contraseña
   ↓
Guardar usuario
   ↓
Login
   ↓
Verificar contraseña
   ↓
Crear JWT
   ↓
Cliente recibe JWT
   ↓
Cliente envía Bearer Token
   ↓
auth.middleware.js
   ↓
Verificar JWT
   ↓
Controller
```

## JWT_SECRET

El secreto utilizado para firmar y verificar los tokens debe estar en una variable de entorno:

```env
JWT_SECRET="tu_secreto"
```

Para generar un secreto aleatorio:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

⚠️ Nunca colocar el secreto directamente en el código ni subirlo al repositorio.

## Registro

El registro normalmente realiza:

```text
Datos del usuario
      ↓
Validación
      ↓
Hash de contraseña
      ↓
Guardar usuario en PostgreSQL
```

La contraseña no debe almacenarse directamente en texto plano.

## Login

El login normalmente realiza:

```text
Email / usuario + contraseña
          ↓
Buscar usuario
          ↓
Comparar contraseña
          ↓
¿Correcta?
    ↓              ↓
   Sí              No
    ↓              ↓
Crear JWT        Rechazar
```

## Enviar el JWT

Una vez autenticado, el cliente recibe el token.

Para acceder a una ruta protegida, normalmente se envía:

```text
Authorization: Bearer <JWT>
```

## `auth.middleware.js`

El middleware de autenticación se encarga de:

```text
1. Obtener el token
2. Verificar el JWT
3. Obtener la información validada
4. Permitir continuar
```

Si el token no existe o no es válido:

```text
request
   ↓
authMiddleware
   ↓
acceso rechazado
```

Si es válido:

```text
request
   ↓
authMiddleware
   ↓
next()
   ↓
controller
```

## Proteger rutas

Una ruta protegida sigue:

```text
request
   ↓
authMiddleware
   ↓
controller
```

Ejemplo conceptual:

```text
/auth
   ├── registro
   └── login

/productos
   ↓
authMiddleware
   ↓
CRUD
```


# PASO 12 --- Crear Controllers

Crear:

```text
src/controllers/
├── auth.controller.js
│── NombreDeAcuerdoAlProyecto.controller.js
```

Aquí se implementan los métodos de la API.

------------------------------------------------------------------------

# PASO 13 --- Crear Routes

Crear:

``` text
src/routes/
├── auth.routes.js
│── NombreDeAcuerdoAlProyecto.routes.js
```

Las rutas conectan:

``` text
endpoint → controller
```

Ejemplo:

``` js
import express from "express"

import {
  listarProductos,
  agregarProducto,
  actualizarCantidad,
  eliminarProducto
} from "../controllers/productos.controller.js"

const router = express.Router()

router.get("/", listarProductos)
router.post("/", agregarProducto)
router.put("/:id", actualizarCantidad)
router.delete("/:id", eliminarProducto)

export default router
```

## Middleware en una ruta

Si una ruta necesita validación:

``` js
router.post("/", validarNumerosPositivos, agregarProducto)
```

Orden:

``` text
request
   ↓
middleware
   ↓
controller
```

------------------------------------------------------------------------

# PASO 14 --- Conectar Routes en `index.js`

``` js
import productosRoutes from "./routes/productos.routes.js"

app.use("/auth", authRoutes)
app.use("/productos", authMiddleware, productosRoutes)
```

Entonces tendremos:

``` text
GET    /productos
POST   /productos
PUT    /productos/:id
DELETE /productos/:id
```

------------------------------------------------------------------------

# PASO 15 --- Probar en Postman

Servidor:

``` text
http://localhost:3000
```

Primero probar:

``` http
GET http://localhost:3000/productos
```

Si todavía no existen productos:

``` json
[]
```

Después probar:

``` text
POST
PUT
DELETE
```

Y todos los endpoints adicionales del ejercicio.

------------------------------------------------------------------------

# 🚨 Reglas para evitar errores

## Regla 1 --- No avanzar si Prisma falla

Ejecutar:

``` bash
npx prisma generate
```

Debe funcionar antes de continuar.

------------------------------------------------------------------------

## Regla 2 --- Mantener configuración consistente

Para estos ejercicios:

``` prisma
generator client {
  provider = "prisma-client-js"
}
```

Sin:

``` prisma
output = ...
```

El cliente se genera en:

``` text
node_modules/@prisma/client
```

Y se importa:

``` js
import { PrismaClient } from "@prisma/client"
```

------------------------------------------------------------------------

## Regla 3 --- Probar cada bloque importante

### Prisma

``` bash
npx prisma generate
```

### Base de datos

``` bash
npx prisma migrate dev --name init
```

### Express

``` bash
npm run dev
```

### API

Probar en Postman:

``` text
GET
POST
PUT
DELETE
```

------------------------------------------------------------------------

# 🔄 Si modifico `schema.prisma`

Cada cambio en el modelo requiere una nueva migración.

### Primera migración

``` bash
npx prisma migrate dev --name init
```

### Cambios posteriores

``` bash
npx prisma migrate dev --name nombre-del-cambio
```

Ejemplo:

``` bash
npx prisma migrate dev --name agregar-votos
```

Flujo:

``` text
Modificar model
      ↓
npx prisma migrate dev --name ...
      ↓
Base de datos actualizada
      ↓
Prisma Client actualizado según el flujo de Prisma
```

------------------------------------------------------------------------


# PASO 17 — Desplegar la API en Railway

Cuando la API funciona correctamente en localhost, se puede desplegar en Railway.

## Flujo

```text
Código local
    ↓
GitHub
    ↓
Railway
    ↓
Build
    ↓
Start
    ↓
API pública
```

## Variables de entorno

Las variables utilizadas localmente en `.env` deben configurarse también en Railway.

Por ejemplo:

```text
DATABASE_URL
JWT_SECRET
PORT
```

En producción:

```text
.env local
     ↓
Variables de entorno de Railway
```

⚠️ El archivo `.env` no se sube al repositorio.

## Root Directory

Si el repositorio contiene varias carpetas, Railway necesita saber cuál contiene la API.

El `Root Directory` debe ser el nombre exacto de la carpeta del repositorio donde está el proyecto de la API.

Si la API está directamente en la raíz del repositorio, no se necesita indicar una subcarpeta.

## Build Command

Configurar:

```bash
npm run build
```

El `build` definido en `package.json` ejecuta:

```bash
prisma generate
```

Flujo:

```text
Railway
   ↓
npm run build
   ↓
prisma generate
```

## Start Command

Configurar:

```bash
npm start
```

El script debe ser:

```json
"start": "node src/index.js"
```

Flujo:

```text
Railway
   ↓
npm start
   ↓
node src/index.js
   ↓
Express
```

## Base de datos en producción

La API desplegada necesita una `DATABASE_URL` válida.

```text
Railway
   ↓
DATABASE_URL
   ↓
Prisma
   ↓
PostgreSQL / Neon
```

La `DATABASE_URL` de producción puede ser diferente de la utilizada durante el desarrollo.

## JWT en producción

También se debe configurar:

```text
JWT_SECRET
```

como variable de entorno de Railway.

No escribir el secreto directamente dentro del código.

## URL pública

En desarrollo:

```text
http://localhost:3000
```

Después del despliegue:

```text
https://tu-api.up.railway.app
```

El cliente debe dejar de utilizar `localhost` y utilizar la URL pública de la API.

## Probar la API desplegada

Después del deployment, probar nuevamente en Postman:

```text
POST /auth/registro
POST /auth/login

GET /productos
POST /productos
PUT /productos/:id
DELETE /productos/:id
```

Comprobar también:

```text
JWT
Rutas protegidas
Conexión con PostgreSQL / Neon
```


# 📁 Estructura final esperada

``` text
ejercicio1/
│
├── node_modules/
├── prisma/
│   ├── migrations/
│   └── schema.prisma
│
├── src/
│   ├── controllers/
│   │   └── productos.controller.js
│   │
│   ├── middlewares/
│   │   ├── logger.middleware.js
│   │   ├── validaciones.middleware.js
│   │   └── auth.middleware.js
│   │
│   ├── routes/
│   │   └── productos.routes.js
│   │
│   ├── db.js
│   └── index.js
│
├── .env
├── .gitignore
├── package.json
├── package-lock.json
└── prisma.config.ts
```

------------------------------------------------------------------------

# ✅ Checklist

## Node

-   [ ] Proyecto creado
-   [ ] `package.json` configurado
-   [ ] `"type": "module"`
-   [ ] Script `start`
-   [ ] Script `dev`

## Dependencias

-   [ ] Express instalado
-   [ ] Prisma 7.10 instalado
-   [ ] `@prisma/client` 7.10 instalado
-   [ ] `@prisma/adapter-pg` instalado
-   [ ] `pg` instalado
-   [ ] `dotenv` instalado
-   [ ] `nodemon` instalado

## Base de datos

-   [ ] Proyecto Neon creado
-   [ ] `.env` configurado
-   [ ] `.gitignore` configurado

## Prisma

-   [ ] `prisma init` ejecutado
-   [ ] `prisma.config.ts` configurado
-   [ ] `schema.prisma` creado
-   [ ] `generator` configurado
-   [ ] No existe `output`
-   [ ] `npx prisma generate` funciona
-   [ ] `npx prisma migrate dev --name init` funciona

## Backend

-   [ ] `src/` creado
-   [ ] `db.js` configurado
-   [ ] `index.js` configurado
-   [ ] `express.json()` configurado
-   [ ] Servidor funcionando

## Middlewares

-   [ ] `logger.middleware.js`
-   [ ] `validaciones.middleware.js`
-   [ ] Middlewares conectados cuando sean necesarios
-   [ ] `next()` utilizado correctamente

## Controllers

-   [ ] Controller creado
-   [ ] Prisma importado correctamente
-   [ ] GET implementado
-   [ ] POST implementado
-   [ ] PUT implementado
-   [ ] DELETE implementado
-   [ ] Operaciones especiales implementadas

## Routes

-   [ ] Routes creadas
-   [ ] Endpoints definidos
-   [ ] Middlewares colocados antes del controller cuando corresponda
-   [ ] Routes conectadas en `index.js`

## Pruebas

-   [ ] GET probado
-   [ ] POST probado
-   [ ] PUT probado
-   [ ] DELETE probado
-   [ ] Endpoints adicionales probados
-   [ ] CRUD funcionando


## JWT / Autenticación

- [ ] `jsonwebtoken` instalado
- [ ] `bcryptjs` instalado
- [ ] `JWT_SECRET` generado
- [ ] `JWT_SECRET` configurado
- [ ] Registro implementado
- [ ] Contraseñas almacenadas mediante hash
- [ ] Login implementado
- [ ] JWT generado
- [ ] `auth.middleware.js` creado
- [ ] JWT verificado
- [ ] Rutas protegidas configuradas
- [ ] `Authorization: Bearer <JWT>` probado

## Railway

- [ ] Código subido al repositorio
- [ ] Servicio creado en Railway
- [ ] Root Directory configurado si corresponde
- [ ] Build Command: `npm run build`
- [ ] Start Command: `npm start`
- [ ] `DATABASE_URL` configurado en Railway
- [ ] `JWT_SECRET` configurado en Railway
- [ ] `PORT` configurado si corresponde
- [ ] Build exitoso
- [ ] Servicio iniciado correctamente
- [ ] URL pública obtenida
- [ ] URL pública probada
- [ ] Registro probado en producción
- [ ] Login probado en producción
- [ ] JWT probado en producción
- [ ] CRUD probado en producción
- [ ] Conexión con PostgreSQL / Neon funcionando
