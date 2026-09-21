# Testing con Jest y Supertest — Express + Prisma + PostgreSQL

## 1. Instalar Jest y Supertest

```bash
npm install -D jest supertest
```



- **Jest:** ejecutar y comprobar pruebas.
- **Supertest:** hacer peticiones HTTP a Express.

## 2. Separar `app.js` de `index.js`

### `src/app.js`

```js
import express from "express";

const app = express();

app.use(express.json());

// rutas...

export default app;
```

### `src/index.js`

```js
import app from "./app.js";

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Puerto ${PORT}`);
});
```

Supertest importa `app` directamente y no necesita levantar `listen()`.

## 3. Crear `jest.config.js`

En la raíz:

```js
export default {
  testEnvironment: "node",
  transform: {},
};
```

## 4. Configurar `package.json`

```json
{
  "scripts": {
    "dev": "nodemon src/index.js",
    "start": "node src/index.js",
    "build": "prisma generate",
    "test": "NODE_OPTIONS=--experimental-vm-modules jest --runInBand"
  }
}
```

`--runInBand` hace que Jest ejecute las pruebas una por una, útil cuando comparten una base de datos.

## 5. Crear `tests/`

```text
tests/
├── auth.test.js
├── v1.tareas.test.js
└── v2.tareas.test.js
```

## 6. Importar Supertest y la app

```js
import request from "supertest";
import app from "../src/app.js";
```

Ejemplo:

```js
const res = await request(app)
  .get("/v1/tareas");
```

## 7. Usar `describe()`, `it()` y `expect()`

```js
describe("POST /auth/registro", () => {

  it("debe registrar un usuario", async () => {

    const res = await request(app)
      .post("/auth/registro")
      .send({
        nombre: "Juan",
        email: "juan@correo.com",
        password: "123456"
      });

    expect(res.statusCode).toBe(201);
  });

});
```

La idea es:

```text
describe()
    ↓
grupo de pruebas

it()
    ↓
comportamiento que se prueba

request()
    ↓
petición HTTP

expect()
    ↓
resultado esperado
```

## 8. Probar métodos HTTP

### GET

```js
const res = await request(app)
  .get("/v1/tareas");

expect(res.statusCode).toBe(200);
```

### POST

```js
const res = await request(app)
  .post("/v1/tareas")
  .send({
    titulo: "Nueva tarea",
    usuarioId: usuarioId
  });

expect(res.statusCode).toBe(201);
```

### DELETE

```js
const res = await request(app)
  .delete(`/v2/tareas/${id}`);

expect(res.statusCode).toBe(200);
```

## 9. Probar API Key

```js
const res = await request(app)
  .get("/v1/tareas")
  .set("x-api-key", process.env.API_KEY);

expect(res.statusCode).toBe(200);
```

También probar:

```text
Sin API Key → 401
API Key incorrecta → 401
API Key correcta → 200
```

## 10. Probar JWT

Primero registrar:

```js
await request(app)
  .post("/auth/registro")
  .send({
    nombre: "Usuario Test",
    email: "usuario@test.com",
    password: "123456"
  });
```

Después login:

```js
const login = await request(app)
  .post("/auth/login")
  .send({
    email: "usuario@test.com",
    password: "123456"
  });

const token = login.body.token;
```

Usar el token:

```js
const res = await request(app)
  .get("/v2/tareas")
  .set("Authorization", `Bearer ${token}`);

expect(res.statusCode).toBe(200);
```

Probar también:

- Sin token → `401`
- Token inválido → `401`
- Usuario normal
- Admin
- Usuario intentando acceder a recursos ajenos

## 11. Probar errores

Ejemplo: registro sin email:

```js
const res = await request(app)
  .post("/auth/registro")
  .send({
    nombre: "Usuario Test",
    password: "123456"
  });

expect(res.statusCode).toBe(400);
```

También probar los códigos esperados para:

- Datos faltantes
- Email duplicado
- Contraseña incorrecta
- Usuario inexistente
- API Key inválida
- Token inválido
- Permisos insuficientes














## 12. Controlar la base de datos con `beforeEach()`

Si los tests crean datos, pueden quedar en PostgreSQL.

Importar Prisma:

```js
import { prisma } from "../src/db.js";
```

Limpiar antes de cada prueba:

```js
beforeEach(async () => {
  await prisma.tarea.deleteMany();
  await prisma.usuario.deleteMany();
});
```

describe("POST /usuarios", () => {

  it("debe crear un usuario", async () => {

    const res = await request(app)
      .post("/usuarios")
      .send({
        nombre: "Juan"
      });

    expect(res.statusCode).toBe(201);

  });

});

## 15. `afterAll()`

`afterAll()` se ejecuta después de todas las pruebas del grupo/archivo.

Puede utilizarse para cerrar recursos:

```js
afterAll(async () => {
  await prisma.$disconnect();
});
```


## 16. Ejecutar las pruebas

```bash
npm test
```

