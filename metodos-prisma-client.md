# Prisma Client --- Guía rápida de consultas

> Chuleta de referencia para consultar mientras trabajas con Prisma 7.

## Índice rápido

  Necesito...                                          Usa
  ---------------------------------------------------- --------------------------------------
  Listar registros                                     `findMany`
  Buscar un registro por un campo único                `findUnique`
  Buscar el primer registro que cumpla una condición   `findFirst`
  Crear un registro                                    `create`
  Crear varios registros                               `createMany`
  Actualizar un registro                               `update`
  Actualizar varios registros                          `updateMany`
  Crear o actualizar según exista                      `upsert`
  Eliminar un registro                                 `delete`
  Eliminar varios registros                            `deleteMany`
  Contar registros                                     `count`
  Calcular estadísticas                                `aggregate`
  Agrupar y calcular estadísticas por grupo            `groupBy`
  Filtrar texto                                        `contains`, `startsWith`, `endsWith`
  Comparar listas                                      `in`, `notIn`
  Comparar números/fechas                              `gt`, `gte`, `lt`, `lte`
  Traer relaciones                                     `include`
  Elegir campos específicos                            `select`
  Ejecutar varias operaciones como una unidad          `$transaction`

------------------------------------------------------------------------

# 1. `findMany`

## ¿Cuándo usarlo?

Cuando necesitas obtener **varios registros** de un modelo.

``` ts
const usuarios = await prisma.usuario.findMany();
```

### `where`

Filtra los registros que quieres obtener.

``` ts
const usuarios = await prisma.usuario.findMany({
  where: {
    activo: true
  }
});
```

**Idea:** `where` decide **qué registros entran** en el resultado.

### `orderBy`

Ordena los resultados.

``` ts
const usuarios = await prisma.usuario.findMany({
  orderBy: {
    nombre: "asc"
  }
});
```

-   `asc` → ascendente
-   `desc` → descendente

### `skip`

Omite una cantidad de registros desde el comienzo.

``` ts
const usuarios = await prisma.usuario.findMany({
  skip: 10
});
```

`skip` **no limita** la cantidad de resultados; solamente indica cuántos
omitir.

### `take`

Limita la cantidad de registros devueltos.

``` ts
const usuarios = await prisma.usuario.findMany({
  take: 10
});
```

### `skip + take`

Se utilizan frecuentemente para paginación.

``` ts
const usuarios = await prisma.usuario.findMany({
  skip: 10,
  take: 10
});
```

**Regla mental:**

``` text
where    → cuáles
orderBy  → en qué orden
skip     → cuántos omitir
take     → cuántos devolver
```

------------------------------------------------------------------------

# 2. `findUnique` vs `findFirst`

## `findUnique`

Busca **un único registro identificado mediante un campo único** o una
combinación única.

``` ts
const usuario = await prisma.usuario.findUnique({
  where: {
    id: 5
  }
});
```

Puede utilizar campos definidos como `@id`, `@unique` o combinaciones
`@@unique`.

### Resultado

Puede devolver:

-   un registro
-   `null` si no existe

### ¿Cuándo usarlo?

Cuando sabes exactamente qué registro buscas mediante un identificador
único.

------------------------------------------------------------------------

## `findFirst`

Busca el **primer registro que cumpla las condiciones**.

``` ts
const usuario = await prisma.usuario.findFirst({
  where: {
    activo: true
  }
});
```

No necesita que el criterio sea único.

Si existen muchos registros que cumplen la condición, devuelve solamente
el primero.

Puedes utilizar `orderBy` para controlar cuál será considerado primero.

### Diferencia principal

``` text
findUnique
→ "Dame EL registro identificado por un valor único."

findFirst
→ "Dame EL PRIMER registro que cumpla esta condición."
```

------------------------------------------------------------------------

# 3. `create`

## ¿Cuándo usarlo?

Cuando necesitas crear **un solo registro**.

``` ts
const usuario = await prisma.usuario.create({
  data: {
    nombre: "Lewis",
    email: "lewis@example.com"
  }
});
```

`data` contiene los datos que se van a insertar.

## Crear con relaciones anidadas

Prisma permite realizar operaciones relacionadas dentro de una creación.

Conceptualmente:

``` text
crear Usuario
   └── crear también Perfil relacionado
```

``` ts
const usuario = await prisma.usuario.create({
  data: {
    nombre: "Lewis",
    perfil: {
      create: {
        bio: "Desarrollador"
      }
    }
  }
});
```

Esto se conoce como **nested writes / operaciones anidadas**.

------------------------------------------------------------------------

# 4. `createMany`

## ¿Cuándo usarlo?

Cuando necesitas crear **muchos registros del mismo modelo**.

``` ts
const resultado = await prisma.usuario.createMany({
  data: [
    { nombre: "Ana" },
    { nombre: "Carlos" },
    { nombre: "Pedro" }
  ]
});
```

Es útil para:

-   cargas masivas
-   seeds
-   importaciones
-   inserciones de muchos registros

### Diferencia

``` text
create     → un registro
createMany → varios registros
```

`createMany` devuelve información sobre la operación, como la cantidad
de registros creados, no funciona igual que `create` en cuanto al
registro creado que retorna.

------------------------------------------------------------------------

# 5. `update` vs `updateMany`

## `update`

Actualiza **un registro**.

Necesita identificarlo mediante un criterio único.

``` ts
const usuario = await prisma.usuario.update({
  where: {
    id: 5
  },
  data: {
    nombre: "Lewis Rodríguez"
  }
});
```

### `updateMany`

Actualiza **todos los registros que cumplan una condición**.

``` ts
const resultado = await prisma.usuario.updateMany({
  where: {
    activo: false
  },
  data: {
    activo: true
  }
});
```

### Diferencia

``` text
update
→ actualiza un registro identificado de forma única

updateMany
→ actualiza todos los registros que cumplan where
```

`update` devuelve el registro actualizado; `updateMany` devuelve
información de la operación, como `count`.

------------------------------------------------------------------------

# 6. `upsert`

## ¿Qué es?

`upsert` combina dos comportamientos:

``` text
UPDATE + INSERT
```

La lógica es:

``` text
¿Existe el registro?
       │
   ┌───┴───┐
  Sí       No
   │        │
 update    create
```

Conceptualmente:

``` ts
const usuario = await prisma.usuario.upsert({
  where: {
    email: "lewis@example.com"
  },
  update: {
    nombre: "Lewis"
  },
  create: {
    nombre: "Lewis",
    email: "lewis@example.com"
  }
});
```

## ¿Cuándo conviene?

Cuando **no sabes si el registro ya existe** y quieres garantizar que
termine existiendo con determinados datos.

### Comparación

``` text
create
→ sé que debe ser nuevo.

update
→ sé que ya existe.

upsert
→ puede existir o no.
```

`upsert` necesita un criterio único en `where`.

------------------------------------------------------------------------

# 7. `delete` vs `deleteMany`

## `delete`

Elimina **un registro** identificado de forma única.

``` ts
await prisma.usuario.delete({
  where: {
    id: 5
  }
});
```

## `deleteMany`

Elimina **todos los registros que cumplan una condición**.

``` ts
await prisma.usuario.deleteMany({
  where: {
    activo: false
  }
});
```

### Diferencia

``` text
delete
→ elimina uno

deleteMany
→ elimina todos los que coincidan con where
```

⚠️ `deleteMany` debe utilizarse con cuidado. Una condición demasiado
amplia puede eliminar muchos registros.

------------------------------------------------------------------------

# 8. `count`

## ¿Cuándo usarlo?

Cuando necesitas saber **cuántos registros existen**, no obtener los
registros.

``` ts
const cantidad = await prisma.usuario.count();
```

También puede utilizar filtros:

``` ts
const cantidad = await prisma.usuario.count({
  where: {
    activo: true
  }
});
```

### Concepto

``` text
findMany → devuelve registros
count    → devuelve una cantidad
```

------------------------------------------------------------------------

# 9. `aggregate`

## ¿Cuándo usarlo?

Cuando necesitas realizar cálculos sobre un conjunto de registros.

Operaciones principales:

``` text
_sum
_avg
_min
_max
```

### Conceptualmente

``` ts
const resultado = await prisma.producto.aggregate({
  _sum: {
    precio: true
  },
  _avg: {
    precio: true
  },
  _min: {
    precio: true
  },
  _max: {
    precio: true
  }
});
```

Puedes combinarlo con `where` para calcular sobre un subconjunto.

``` text
todos los registros
        ↓
      where
        ↓
registros filtrados
        ↓
   aggregate
        ↓
 suma / promedio / mínimo / máximo
```

### Diferencia con `count`

``` text
count     → ¿cuántos hay?

aggregate → ¿cuál es la suma, promedio, mínimo o máximo?
```

------------------------------------------------------------------------

# 10. `groupBy`

## ¿Cuándo usarlo?

Cuando necesitas **agrupar registros por uno o más campos** y realizar
cálculos sobre cada grupo.

Por ejemplo, conceptualmente:

``` text
Productos
   │
   ├── categoría A
   ├── categoría A
   ├── categoría B
   ├── categoría B
   └── categoría C
```

`groupBy` puede producir:

``` text
categoría A → cantidad, suma, promedio...
categoría B → cantidad, suma, promedio...
categoría C → cantidad, suma, promedio...
```

Puede combinarse con:

``` text
_count
_sum
_avg
_min
_max
```

### Diferencia con `aggregate`

``` text
aggregate
→ calcula sobre el conjunto completo.

groupBy
→ divide el conjunto en grupos
  y calcula sobre cada grupo.
```

------------------------------------------------------------------------

# 11. Filtros avanzados

Estos operadores se utilizan principalmente dentro de `where`.

## Texto

### `contains`

Busca textos que **contengan** un valor.

``` ts
where: {
  nombre: {
    contains: "car"
  }
}
```

### `startsWith`

Busca textos que **comiencen** con un valor.

``` ts
where: {
  nombre: {
    startsWith: "Car"
  }
}
```

### `endsWith`

Busca textos que **terminen** con un valor.

``` ts
where: {
  email: {
    endsWith: "@gmail.com"
  }
}
```

### Regla mental

``` text
contains   → contiene
startsWith → comienza con
endsWith   → termina con
```

------------------------------------------------------------------------

## Pertenencia

### `in`

Busca valores que estén dentro de una lista.

``` ts
where: {
  id: {
    in: [1, 2, 3]
  }
}
```

### `notIn`

Busca valores que **no** estén dentro de una lista.

``` ts
where: {
  id: {
    notIn: [1, 2, 3]
  }
}
```

``` text
in     → está dentro
notIn  → no está dentro
```

------------------------------------------------------------------------

## Comparaciones

  Operador   Significado     Equivalente
  ---------- --------------- -------------
  `gt`       mayor que       `>`
  `gte`      mayor o igual   `>=`
  `lt`       menor que       `<`
  `lte`      menor o igual   `<=`

Ejemplo conceptual:

``` ts
where: {
  edad: {
    gte: 18
  }
}
```

Significa:

``` text
edad >= 18
```

Estos operadores son especialmente útiles para números, fechas y otros
valores comparables.

------------------------------------------------------------------------

# 12. Relaciones: `include` y `select`

## `include`

Se utiliza para **traer datos relacionados** junto con el registro
principal.

Conceptualmente:

``` text
Usuario
   │
   └── pedidos
         ├── Pedido 1
         ├── Pedido 2
         └── Pedido 3
```

``` ts
const usuario = await prisma.usuario.findUnique({
  where: {
    id: 1
  },
  include: {
    pedidos: true
  }
});
```

La idea es:

> "Tráeme el usuario y también sus pedidos."

------------------------------------------------------------------------

## `select`

Se utiliza para elegir **qué campos quieres recibir**.

``` ts
const usuario = await prisma.usuario.findUnique({
  where: {
    id: 1
  },
  select: {
    id: true,
    nombre: true,
    email: true
  }
});
```

La idea es:

> "De este registro, solamente necesito estos campos."

### Diferencia

``` text
include → quiero incluir relaciones.

select  → quiero elegir exactamente qué campos devolver.
```

------------------------------------------------------------------------

# 13. Transacciones: `$transaction`

## ¿Qué es una transacción?

Una transacción es un conjunto de operaciones que se trata como **una
sola unidad de trabajo**.

Con:

``` ts
prisma.$transaction(...)
```

puedes ejecutar varias operaciones de base de datos dentro de una
transacción.

### Atomicidad

La propiedad fundamental es:

> **Todo o nada.**

Conceptualmente:

``` text
Operación A → ✅
Operación B → ✅
Operación C → ❌
                 ↓
              ROLLBACK
                 ↓
        Se revierten los cambios
```

Si todas funcionan:

``` text
A → ✅
B → ✅
C → ✅
     ↓
   COMMIT
     ↓
Cambios aplicados
```

### ¿Cuándo usarlo?

Cuando varias operaciones están relacionadas y **no quieres que unas se
guarden si otra falla**.

Ejemplo conceptual:

``` text
Crear pedido
     +
Reducir inventario
     +
Registrar pago
```

Estas operaciones pueden necesitar ejecutarse como una unidad.

### Diferencia importante

``` text
prisma.usuario.create()
→ operación de un modelo

prisma.$transaction()
→ coordina múltiples operaciones como una unidad
```

------------------------------------------------------------------------

# 🧠 Mapa mental general

``` text
CONSULTAR
│
├── findMany
│   ├── where
│   ├── orderBy
│   ├── skip
│   └── take
│
├── findUnique
│
└── findFirst


CREAR
│
├── create
│   └── relaciones anidadas
│
└── createMany


ACTUALIZAR
│
├── update
├── updateMany
└── upsert


ELIMINAR
│
├── delete
└── deleteMany


ANALIZAR
│
├── count
├── aggregate
└── groupBy


FILTRAR
│
├── contains
├── startsWith
├── endsWith
├── in
├── notIn
├── gt
├── gte
├── lt
└── lte


RELACIONES / CAMPOS
│
├── include
└── select


OPERACIONES ATÓMICAS
│
└── prisma.$transaction()
```

------------------------------------------------------------------------

# ⚡ Chuleta de decisión

Cuando estés programando, piensa:

``` text
¿Necesito varios registros?
→ findMany

¿Necesito exactamente un registro por ID/unique?
→ findUnique

¿Necesito el primero que cumpla una condición?
→ findFirst

¿Voy a crear uno?
→ create

¿Voy a crear muchos?
→ createMany

¿Voy a actualizar uno?
→ update

¿Voy a actualizar muchos?
→ updateMany

¿Puede existir o no y quiero crear/actualizar?
→ upsert

¿Voy a eliminar uno?
→ delete

¿Voy a eliminar muchos?
→ deleteMany

¿Solo necesito saber cuántos hay?
→ count

¿Necesito suma/promedio/mínimo/máximo?
→ aggregate

¿Necesito esos cálculos separados por grupos?
→ groupBy

¿Necesito relaciones?
→ include

¿Necesito solamente ciertos campos?
→ select

¿Necesito varias operaciones como una unidad?
→ $transaction
```
