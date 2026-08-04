# Historias de usuario — Pruebas automatizadas con Selenium

Proyecto: **MiniMarket (`rd-market`)** — Next.js 16, Prisma 7 y SQLite.
Alcance de la automatizacion: **inicio de sesion** y **CRUD de productos**.

Cada historia tiene al menos un caso de prueba automatizado con Selenium WebDriver
(JavaScript + Mocha). En total son **5 historias** y **11 casos de prueba**, repartidos entre
camino feliz, pruebas negativas y pruebas de limites.

Este documento es la fuente de la que se publican las historias en Jira.

## Resumen

| Historia | Casos | Feliz | Negativa | Limites | Archivo de pruebas |
| --- | --- | --- | --- | --- | --- |
| HU-01 Iniciar sesion | 3 | CP-01 | CP-02 | CP-03 | `tests-selenium/01-login.spec.js` |
| HU-02 Crear producto | 3 | CP-04 | CP-05 | CP-06 | `tests-selenium/02-crear-producto.spec.js` |
| HU-03 Consultar listado | 2 | CP-07 | CP-08 | — | `tests-selenium/03-listar-productos.spec.js` |
| HU-04 Editar producto | 2 | CP-09 | CP-10 | — | `tests-selenium/04-editar-producto.spec.js` |
| HU-05 Eliminar producto | 1 | CP-11 | — | — | `tests-selenium/05-eliminar-producto.spec.js` |

Datos de partida (los carga `prisma/seed.ts`): usuario `ana@minimarket.com` / `ana1234`
y cuatro productos, entre ellos `Arroz 1kg` (Granos, $1.75, stock 40).

---

## HU-01 — Iniciar sesion en MiniMarket

> **Como** empleado del minimarket
> **quiero** entrar a la aplicacion con mi correo y mi contrasena
> **para** que solo el personal autorizado pueda consultar y modificar el inventario.

### Criterios de aceptacion

1. La ruta `/login` muestra un formulario con los campos **Email** y **Contrasena** y el boton
   **Iniciar sesion**.
2. Con un correo registrado y su contrasena correcta, el sistema crea la sesion y redirige a la
   portada (`/`).
3. Una vez dentro, la barra superior muestra el nombre del usuario y la opcion **Cerrar sesion**.
4. Los campos Email y Contrasena son obligatorios.
5. La sesion se guarda en una cookie firmada (`httpOnly`), no en el almacenamiento del navegador.

### Criterios de rechazo

1. Se rechaza el acceso si la contrasena no corresponde al correo indicado.
2. Se rechaza el acceso si el correo no esta registrado.
3. En ambos casos se muestra el mensaje **"Credenciales invalidas."**, sin revelar cual de los dos
   datos fallo, y el usuario permanece en `/login`.
4. No se envia el formulario si Email o Contrasena estan vacios.
5. Tras un intento fallido no queda ninguna sesion abierta: las rutas protegidas siguen devolviendo
   al login.

### Casos de prueba

| ID | Tipo | Pasos | Resultado esperado |
| --- | --- | --- | --- |
| **CP-01** | Camino feliz | Abrir `/login`, escribir `ana@minimarket.com` y `ana1234`, pulsar **Iniciar sesion** | Redirige a `/`; la cabecera contiene "Ana Perez" y "Cerrar sesion" |
| **CP-02** | Negativa | Igual que CP-01 pero con la contrasena `clave-incorrecta`; despues intentar entrar a `/productos` | Permanece en `/login` con el mensaje "Credenciales invalidas."; `/productos` vuelve a redirigir al login |
| **CP-03** | Limites | Pulsar **Iniciar sesion** con el formulario vacio; luego con el email puesto y la contrasena vacia | No hay navegacion en ninguno de los dos intentos; el navegador marca como invalido primero el email y despues la contrasena |

---

## HU-02 — Crear un producto

> **Como** encargado del inventario
> **quiero** registrar un producto nuevo con su precio y su stock
> **para** que quede disponible para la venta.

### Criterios de aceptacion

1. Desde `/productos`, el boton **Nuevo producto** lleva al formulario `/productos/nuevo`.
2. El formulario pide Nombre, Descripcion, Precio, Stock y Categoria; Nombre, Precio y Stock son
   obligatorios.
3. Al guardar datos validos, la aplicacion vuelve a `/productos` y el producto aparece en la tabla.
4. El precio se muestra en el listado con dos decimales y el simbolo de moneda (por ejemplo `$4.75`).
5. Se aceptan **precio 0** y **stock 0** como valores minimos validos.

### Criterios de rechazo

1. Se rechaza el alta si el nombre esta vacio o solo tiene espacios, con el mensaje
   **"El nombre del producto es obligatorio."**
2. Se rechaza el alta si el precio no es un numero mayor o igual a cero, con el mensaje
   **"El precio debe ser un numero mayor o igual a cero."**
3. Se rechaza el alta si el stock no es un entero mayor o igual a cero, con el mensaje
   **"El stock debe ser un numero entero mayor o igual a cero."**
4. Cuando el alta se rechaza, el usuario permanece en el formulario y el producto no se crea.

### Casos de prueba

| ID | Tipo | Pasos | Resultado esperado |
| --- | --- | --- | --- |
| **CP-04** | Camino feliz | Con sesion iniciada, ir a `/productos`, pulsar **Nuevo producto**, rellenar nombre, descripcion, precio `4.75`, stock `15`, categoria `Panaderia`, y pulsar **Crear producto** | Redirige a `/productos`; la fila del producto muestra `Panaderia`, `$4.75` y `15` |
| **CP-05** | Negativa | Igual que CP-04 pero con el nombre formado solo por espacios (supera el `required` del navegador y lo rechaza el servidor) | Vuelve a `/productos/nuevo?error=...` con el mensaje "El nombre del producto es obligatorio." |
| **CP-06** | Limites | Crear un producto con precio `0` y stock `0`, los valores minimos permitidos | El producto se crea; la fila muestra `$0.00` y `0` |

---

## HU-03 — Consultar el listado de productos

> **Como** empleado del minimarket
> **quiero** ver todos los productos con su precio y su stock
> **para** saber que hay disponible sin tener que abrir cada ficha.

### Criterios de aceptacion

1. La ruta `/productos` muestra una tabla con las columnas **Nombre, Categoria, Precio, Stock y
   Acciones**.
2. Cada producto registrado ocupa una fila con sus datos actuales.
3. El precio se muestra con dos decimales y el stock como numero entero.
4. Cada fila ofrece las acciones **Editar** y **Eliminar**.

### Criterios de rechazo

1. Se rechaza el acceso al listado si no hay sesion iniciada: la aplicacion redirige a `/login`.
2. Lo mismo aplica al resto de rutas protegidas (`/`, `/usuarios`, `/compras`).

### Casos de prueba

| ID | Tipo | Pasos | Resultado esperado |
| --- | --- | --- | --- |
| **CP-07** | Camino feliz | Con sesion iniciada, abrir `/productos` | La cabecera de la tabla es Nombre, Categoria, Precio, Stock y Acciones; hay al menos 4 filas; `Arroz 1kg` muestra `Granos`, `$1.75` y `40` |
| **CP-08** | Negativa | Sin iniciar sesion, abrir directamente `/productos` | La aplicacion redirige a `/login` y no muestra ningun dato del inventario |

---

## HU-04 — Editar un producto existente

> **Como** encargado del inventario
> **quiero** corregir el precio y el stock de un producto ya registrado
> **para** mantener la informacion al dia sin tener que borrarlo y volver a crearlo.

### Criterios de aceptacion

1. La accion **Editar** de cada fila abre `/productos/{id}/editar` con el formulario precargado con
   los datos actuales del producto.
2. Al guardar cambios validos, la aplicacion vuelve a `/productos` y la fila refleja los datos
   nuevos.
3. Se aplican las mismas reglas de validacion que en el alta.

### Criterios de rechazo

1. Se rechaza el guardado si el nombre queda vacio; el formulario no se envia.
2. Se rechaza el guardado si el precio o el stock dejan de cumplir las reglas de HU-02, con los
   mismos mensajes.
3. Cuando el guardado se rechaza, el producto conserva sus datos anteriores.

### Casos de prueba

| ID | Tipo | Pasos | Resultado esperado |
| --- | --- | --- | --- |
| **CP-09** | Camino feliz | Con sesion iniciada y un producto ya creado, pulsar **Editar**, cambiar precio a `7.25` y stock a `33`, pulsar **Guardar cambios** | Redirige a `/productos`; la fila muestra `$7.25` y `33` |
| **CP-10** | Negativa | En el formulario de edicion, borrar el nombre y pulsar **Guardar cambios** | No hay navegacion, el navegador marca el nombre como invalido y el producto sigue en el listado con su nombre original |

---

## HU-05 — Eliminar un producto

> **Como** encargado del inventario
> **quiero** dar de baja un producto que ya no se vende
> **para** que deje de aparecer en el listado.

### Criterios de aceptacion

1. Cada fila del listado tiene un boton **Eliminar**.
2. Al pulsarlo, el producto desaparece de la tabla sin necesidad de recargar la pagina.
3. La tabla queda con una fila menos.
4. El resto de productos no se ve afectado.

### Criterios de rechazo

1. Se rechaza el borrado si no hay sesion iniciada (la ruta esta protegida).
2. Un producto ya eliminado no vuelve a aparecer en el listado.

### Casos de prueba

| ID | Tipo | Pasos | Resultado esperado |
| --- | --- | --- | --- |
| **CP-11** | Camino feliz | Con sesion iniciada y un producto ya creado, abrir `/productos`, contar las filas y pulsar **Eliminar** en la fila del producto | El producto desaparece del listado y el total de filas baja en uno |

---

## Trazabilidad

| Caso | Historia | Tipo | Archivo |
| --- | --- | --- | --- |
| CP-01 | HU-01 | Camino feliz | `tests-selenium/01-login.spec.js` |
| CP-02 | HU-01 | Negativa | `tests-selenium/01-login.spec.js` |
| CP-03 | HU-01 | Limites | `tests-selenium/01-login.spec.js` |
| CP-04 | HU-02 | Camino feliz | `tests-selenium/02-crear-producto.spec.js` |
| CP-05 | HU-02 | Negativa | `tests-selenium/02-crear-producto.spec.js` |
| CP-06 | HU-02 | Limites | `tests-selenium/02-crear-producto.spec.js` |
| CP-07 | HU-03 | Camino feliz | `tests-selenium/03-listar-productos.spec.js` |
| CP-08 | HU-03 | Negativa | `tests-selenium/03-listar-productos.spec.js` |
| CP-09 | HU-04 | Camino feliz | `tests-selenium/04-editar-producto.spec.js` |
| CP-10 | HU-04 | Negativa | `tests-selenium/04-editar-producto.spec.js` |
| CP-11 | HU-05 | Camino feliz | `tests-selenium/05-eliminar-producto.spec.js` |

## Evidencias

- **Reporte HTML**: `tests-selenium/reportes/reporte.html` (generado por mochawesome).
- **Capturas automaticas**: `tests-selenium/reportes/capturas/`, una por caso de prueba, tomadas
  pase o falle el caso y adjuntas al reporte.

## Como ejecutar las pruebas

```bash
npm install
cp .env.example .env      # ajusta SESSION_SECRET
npm run db:migrate
npm run db:seed
npm run dev               # en una terminal, deja la app en http://localhost:3000

npm run test:e2e          # en otra terminal
```

Las pruebas dejan la base de datos en un estado conocido ejecutando el seed antes de empezar, y
abren un navegador limpio en cada caso para que ninguna sesion se filtre de una prueba a otra.
