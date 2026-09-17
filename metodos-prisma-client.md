# Prisma Client --- Guía rápida de consultas

> Chuleta de referencia para consultar mientras trabajas con Prisma 7.

## Índice rápido

  METODO                                                       UTILIZO
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

## `findFirst`
``` ts
const libro = await prisma.libro.findFirst({
  where: {
    categoria: "novela"
  }
});
```

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

``` ts
const usuario = await prisma.usuario.create({
  data: {
    nombre: "Lewis",
    email: "lewis@example.com"
  }
});
```

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

------------------------------------------------------------------------

# 5. `update` vs `updateMany`

## `update`

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


# 7. `delete` vs `deleteMany`

## `delete`

``` ts
await prisma.usuario.delete({
  where: {
    id: 5
  }
});
```

## `deleteMany`

``` ts
await prisma.usuario.deleteMany({
  where: {
    activo: false
  }
});
```

------------------------------------------------------------------------

# 8. `count`

## ¿Cuándo usarlo?

Cuando necesitas saber **cuántos registros existen**

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

------------------------------------------------------------------------

# 9. `aggregate`

Cuando necesitas realizar cálculos sobre un conjunto de registros.

Operaciones principales:

``` text
_sum
_avg:promedio
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

``` ts
const resultado = await prisma.producto.aggregate({
  where: {
    categoria: "comida"
  },

  _sum: {
    precio: true
  },
});
```
------------------------------------------------------------------------

# 10. `groupBy`

Cuando necesitas **agrupar registros por uno o más campos** y realizar
cálculos sobre cada grupo.

```ts
const resultado = await prisma.producto.groupBy({
  by: ["categoria"],

  _count: {
    id: true
  }
});
```


`groupBy` puede producir:

``` text
categoría A → cantidad, suma, promedio...
categoría B → cantidad, suma, promedio...
categoría C → cantidad, suma, promedio...
```

```ts
const resultado = await prisma.producto.groupBy({
  by: ["categoria"],

  _sum: {
    precio: true
  }
});
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





------------------------------------------------------------------------




# 12. Include y Select

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