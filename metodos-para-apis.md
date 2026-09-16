# JavaScript --- Palabras y métodos usados en APIs

> Chuleta de referencia rápida para consultar mientras trabajas con
> APIs.

## Índice rápido

  Palabra / Método   Uso
  ------------------ -------------------------------------------------
  `const`            Declarar valores que no se reasignan
  `let`              Declarar valores que pueden cambiar
  `if`               Evaluar condiciones
  `return`           Devolver un valor o salir de una función
  `find()`           Buscar un elemento
  `findIndex()`      Buscar la posición de un elemento
  `filter()`         Obtener elementos que cumplen una condición
  `map()`            Transformar elementos
  `reduce()`         Acumular o calcular un resultado
  `push()`           Agregar elementos
  `splice()`         Eliminar o modificar elementos
  `parseInt()`       Convertir un valor a número entero
  `async`            Declarar una función asíncrona
  `await`            Esperar el resultado de una operación asíncrona
  `try`              Intentar ejecutar un bloque de código
  `catch`            Capturar y manejar errores

------------------------------------------------------------------------

# 1. `const`

## ¿Cuándo usarlo?

Cuando declaras una variable cuyo **valor no será reasignado**.

``` js
const nombre = "Lewis";
```

### Idea clave

`const` no significa que el valor sea absolutamente inmutable en todos
los casos. Significa que la **variable no puede ser reasignada**.

``` text
const
→ no puedo asignarle otro valor a la variable
```

------------------------------------------------------------------------

# 2. `let`

## ¿Cuándo usarlo?

Cuando una variable **necesita cambiar de valor** durante la ejecución.

``` js
let cantidad = 10;
cantidad = 20;
```

### Diferencia

``` text
const → no se reasigna
let   → se puede reasignar
```

------------------------------------------------------------------------

# 3. `if`

## ¿Cuándo usarlo?

Para ejecutar código dependiendo de si una condición es verdadera.

``` js
if (cantidad > 0) {
  // ejecutar
}
```

### Idea clave

``` text
if
→ "si esta condición se cumple, haz esto"
```

Es muy utilizado en APIs para validar:

-   si existe un registro
-   si un usuario está autorizado
-   si un dato es válido
-   si una operación puede realizarse

------------------------------------------------------------------------

# 4. `return`

## ¿Cuándo usarlo?

Tiene dos funciones principales:

1.  **Devolver un valor** desde una función.
2.  **Finalizar la ejecución** de una función.

``` js
function sumar(a, b) {
  return a + b;
}
```

También puede utilizarse para salir antes de continuar con una función.

``` text
return
→ devuelve un resultado
→ o termina la función
```

------------------------------------------------------------------------

# 5. `find()`

## ¿Cuándo usarlo?

Para buscar **un elemento** dentro de un array que cumpla una condición.

``` js
const usuario = usuarios.find(
  usuario => usuario.id === 5
);
```

### Resultado

Devuelve:

``` text
el primer elemento que coincide
```

Si no encuentra ninguno:

``` text
undefined
```

### Diferencia mental

``` text
find()
→ quiero UN elemento
```

------------------------------------------------------------------------

# 6. `findIndex()`

## ¿Cuándo usarlo?

Para buscar la **posición (índice)** del primer elemento que cumple una
condición.

``` js
const index = usuarios.findIndex(
  usuario => usuario.id === 5
);
```

### Resultado

Si encuentra el elemento:

``` text
0, 1, 2, 3...
```

Si no lo encuentra:

``` text
-1
```

### Diferencia

``` text
find()
→ devuelve el elemento

findIndex()
→ devuelve su posición
```

------------------------------------------------------------------------

# 7. `filter()`

## ¿Cuándo usarlo?

Para obtener **todos los elementos** que cumplen una condición.

``` js
const activos = usuarios.filter(
  usuario => usuario.activo === true
);
```

### Resultado

Siempre devuelve un **nuevo array**.

Puede contener:

``` text
muchos elementos
un elemento
ningún elemento
```

### Diferencia mental

``` text
find()
→ primer elemento que coincide

filter()
→ todos los elementos que coinciden
```

------------------------------------------------------------------------

# 8. `map()`

## ¿Cuándo usarlo?

Para **transformar cada elemento** de un array y obtener un nuevo array.

``` js
const nombres = usuarios.map(
  usuario => usuario.nombre
);
```

Si el array original tiene 5 elementos, normalmente `map()` produce un
nuevo array con 5 elementos.

### Idea clave

``` text
map()
→ recorre
→ transforma
→ devuelve un nuevo array
```

En APIs es común utilizarlo para transformar datos antes de enviarlos
como respuesta.

------------------------------------------------------------------------

# 9. `reduce()`

## ¿Cuándo usarlo?

Para recorrer un array y **acumular un resultado**.

Puede utilizarse para calcular:

-   totales
-   sumas
-   conteos
-   acumulaciones
-   objetos derivados de un array

``` js
const total = productos.reduce(
  (acumulador, producto) =>
    acumulador + producto.precio,
  0
);
```

### Idea mental

``` text
reduce()
→ muchos elementos
→ un proceso de acumulación
→ un resultado
```

El resultado no necesariamente tiene que ser un número; puede ser
cualquier valor que construyas mediante el acumulador.

------------------------------------------------------------------------

# 10. `push()`

## ¿Cuándo usarlo?

Para **agregar uno o más elementos al final de un array**.

``` js
productos.push(nuevoProducto);
```

### Importante

`push()` modifica el array original.

``` text
push()
→ agrega al final
→ modifica el array original
```

------------------------------------------------------------------------

# 11. `splice()`

## ¿Cuándo usarlo?

Para **eliminar, reemplazar o insertar elementos** en una posición
determinada de un array.

``` js
productos.splice(index, 1);
```

En este caso:

``` text
index → posición desde donde actuar
1     → cantidad de elementos a eliminar
```

### Puede utilizarse para

``` text
eliminar
reemplazar
insertar
```

### Importante

`splice()` modifica el array original.

------------------------------------------------------------------------

# 12. `parseInt()`

## ¿Cuándo usarlo?

Para convertir un valor a un **número entero**.

``` js
const edad = parseInt("25");
```

Resultado:

``` text
25
```

Es especialmente común en APIs cuando un dato llega como texto y
necesitas trabajar con un entero.

### Idea clave

``` text
parseInt()
→ intenta convertir a entero
```

⚠️ Si el valor no puede convertirse correctamente, puede producir `NaN`.

------------------------------------------------------------------------

# 13. `async`

## ¿Cuándo usarlo?

Para declarar una función como **asíncrona**.

``` js
async function obtenerUsuarios() {
  // ...
}
```

Una función `async` siempre devuelve una **Promise**.

Se utiliza frecuentemente en APIs para trabajar con operaciones que
tardan en completarse, como:

-   consultas a bases de datos
-   peticiones HTTP
-   lectura de archivos
-   servicios externos

### Idea clave

``` text
async
→ esta función trabaja de forma asíncrona
→ devuelve una Promise
```

------------------------------------------------------------------------

# 14. `await`

## ¿Cuándo usarlo?

Para esperar el resultado de una **Promise** dentro de una función
`async`.

``` js
const usuarios = await obtenerUsuarios();
```

La ejecución de esa función espera a que la Promise se resuelva antes de
continuar con esa línea.

### Idea clave

``` text
await
→ espera el resultado de una Promise
```

### Relación

``` text
async
   ↓
permite utilizar await
   ↓
await espera una Promise
```

------------------------------------------------------------------------

# 15. `try`

## ¿Cuándo usarlo?

Para colocar código que podría producir un error y que quieres manejar
mediante `catch`.

``` js
try {
  // código que podría fallar
}
```

En APIs es común utilizarlo alrededor de operaciones como:

-   consultas a la base de datos
-   peticiones a otros servicios
-   operaciones asíncronas

### Idea clave

``` text
try
→ "intenta ejecutar este código"
```

------------------------------------------------------------------------

# 16. `catch`

## ¿Cuándo usarlo?

Para **capturar y manejar un error** producido dentro de un `try`.

``` js
try {
  // operación
} catch (error) {
  // manejar error
}
```

### Relación

``` text
try
 ↓
intenta ejecutar
 ↓
¿ocurrió un error?
 ↓
catch
 ↓
manejar el error
```

------------------------------------------------------------------------

# 🧠 Mapa mental

``` text
VARIABLES
│
├── const
└── let


CONTROL
│
├── if
└── return


BUSCAR EN ARRAYS
│
├── find()
└── findIndex()


FILTRAR / TRANSFORMAR
│
├── filter()
├── map()
└── reduce()


MODIFICAR ARRAYS
│
├── push()
└── splice()


CONVERSIÓN
│
└── parseInt()


ASINCRONÍA
│
├── async
└── await


ERRORES
│
├── try
└── catch
```

------------------------------------------------------------------------

# ⚡ Chuleta de decisión

``` text
¿No voy a reasignar la variable?
→ const

¿Necesito reasignarla?
→ let

¿Necesito una condición?
→ if

¿Necesito devolver un resultado o terminar una función?
→ return

¿Busco un elemento?
→ find()

¿Busco la posición de un elemento?
→ findIndex()

¿Quiero todos los elementos que cumplen una condición?
→ filter()

¿Quiero transformar cada elemento?
→ map()

¿Necesito acumular/calcular un resultado?
→ reduce()

¿Quiero agregar al final de un array?
→ push()

¿Quiero eliminar, insertar o reemplazar en una posición?
→ splice()

¿Necesito convertir a entero?
→ parseInt()

¿La función realiza operaciones asíncronas?
→ async

¿Necesito esperar una Promise?
→ await

¿Puede ocurrir un error que quiero manejar?
→ try + catch
```
