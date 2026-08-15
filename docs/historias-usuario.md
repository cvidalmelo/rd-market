# Historias de usuario

Proyecto: **MiniMarket (`rd-market`)** — Next.js 16, Prisma 7, SQLite y Better Auth.
Alcance de la automatizacion: **autenticacion**, **control de acceso por rol** y **CRUD de
productos**.

Cada historia tiene al menos un caso de prueba automatizado con Selenium WebDriver
(JavaScript + Mocha). En total son **10 historias** repartidas en **2 epicas** y **16 casos de
prueba**, entre camino feliz, pruebas negativas y pruebas de limites.

Este documento es la fuente de la que se publican las historias en Jira (espacios `MM4` publico y
`MMT` privado, en <https://carlosvidalmelo.atlassian.net>).

## Epicas

| Epica | Historias | Puntos | Objetivo |
| --- | --- | --- | --- |
| **E-01 Automatizacion CRUD con Selenium** | HU-01 a HU-05 | 21 | Inventario funcional con su suite de pruebas automatizadas |
| **E-02 Autenticacion y control de acceso con Better Auth** | HU-06 a HU-10 | 26 | Cuentas reales, contrasenas cifradas y permisos por rol |

## Resumen

| Historia | Epica | Puntos | Casos | Feliz | Negativa | Limites | Archivo de pruebas |
| --- | --- | --- | --- | --- | --- | --- | --- |
| HU-01 Iniciar sesion | E-01 | 5 | 3 | CP-01 | CP-02 | CP-03 | `tests-selenium/01-login.spec.js` |
| HU-02 Crear producto | E-01 | 5 | 3 | CP-04 | CP-05 | CP-06 | `tests-selenium/02-crear-producto.spec.js` |
| HU-03 Consultar listado | E-01 | 3 | 2 | CP-07 | CP-08 | — | `tests-selenium/03-listar-productos.spec.js` |
| HU-04 Editar producto | E-01 | 5 | 2 | CP-09 | CP-10 | — | `tests-selenium/04-editar-producto.spec.js` |
| HU-05 Eliminar producto | E-01 | 3 | 1 | CP-11 | — | — | `tests-selenium/05-eliminar-producto.spec.js` |
| HU-06 Registrar una cuenta | E-02 | 3 | 2 | CP-12 | CP-13 | — | `tests-selenium/06-registro.spec.js` |
| HU-07 Sesion con Better Auth | E-02 | 5 | 3 | CP-01 | CP-02 | CP-03 | `tests-selenium/01-login.spec.js` |
| HU-08 Administrar usuarios | E-02 | 8 | 1 | — | CP-14 | — | `tests-selenium/07-roles-y-permisos.spec.js` |
| HU-09 Ver solo mis compras | E-02 | 5 | 1 | CP-15 | — | — | `tests-selenium/08-mis-compras.spec.js` |
| HU-10 Catalogo solo lectura para el cliente | E-02 | 5 | 1 | — | CP-16 | — | `tests-selenium/07-roles-y-permisos.spec.js` |

HU-07 se verifica con los mismos casos que HU-01: son la misma pantalla de login, ahora respaldada
por Better Auth en lugar de la cookie firmada a mano.

Datos de partida (los carga `prisma/seed.ts`):

| Cuenta | Contrasena | Rol | Compra de ejemplo |
| --- | --- | --- | --- |
| `ana@minimarket.com` | `ana1234` | Administradora | 2 x Leche entera 1L |
| `carlos@minimarket.com` | `carlos1234` | Cliente | 1 x Pan de molde |

Ademas se cargan cuatro productos, entre ellos `Arroz 1kg` (Granos, $1.75, stock 40).

---

## HU-01 — Iniciar sesion en MiniMarket

> **Como** empleado del minimarket
> **quiero** entrar a la aplicacion con mi correo y mi contrasena
> **para** que solo el personal autorizado pueda consultar y modificar el inventario.

> **Epica:** E-01 · **Puntos de historia:** 5

### Criterios de aceptacion

1. La ruta `/login` muestra un formulario con los campos **Email** y **Contrasena** y el boton
   **Iniciar sesion**.
2. Con un correo registrado y su contrasena correcta, el sistema crea la sesion y redirige a la
   portada (`/`).
3. Una vez dentro, la barra superior muestra el nombre del usuario y la opcion **Cerrar sesion**.
4. Los campos Email y Contrasena son obligatorios.
5. La sesion se guarda en una cookie `httpOnly` gestionada por Better Auth y respaldada por la tabla
   `session`, no en el almacenamiento del navegador.

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

> **Epica:** E-01 · **Puntos de historia:** 5

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

> **Epica:** E-01 · **Puntos de historia:** 3

### Criterios de aceptacion

1. La ruta `/productos` muestra una tabla con las columnas **Nombre, Categoria, Precio y Stock**, mas
   la columna **Acciones** cuando la sesion es de administracion.
2. Cada producto registrado ocupa una fila con sus datos actuales.
3. El precio se muestra con dos decimales y el stock como numero entero.
4. Para la administracion, cada fila ofrece las acciones **Editar** y **Eliminar**.

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

> **Epica:** E-01 · **Puntos de historia:** 5

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

> **Epica:** E-01 · **Puntos de historia:** 3

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

## HU-06 — Registrarme con email y contrasena

> **Como** cliente del minimarket
> **quiero** crear mi propia cuenta con mi correo y una contrasena
> **para** poder entrar y consultar mis compras sin depender de la administracion.
>
> **Epica:** E-02 · **Puntos de historia:** 3

### Criterios de aceptacion

1. La ruta `/registro` es publica y muestra un formulario con **Nombre**, **Email** y
   **Contrasena**, mas el boton **Crear cuenta**.
2. Al enviar datos validos se crea la cuenta con el rol **cliente** (`user`) y se inicia la sesion
   automaticamente, llevando a la portada (`/`).
3. La contrasena se guarda cifrada (scrypt) en la tabla `account`; en ninguna pantalla vuelve a
   mostrarse en claro.
4. Desde `/login` hay un enlace visible para llegar al registro, y viceversa.
5. La cuenta recien creada no ve el enlace **Usuarios** en la barra de navegacion.

### Criterios de rechazo

1. Se rechaza el alta si el email ya esta registrado, con el mensaje
   **"Ya existe un usuario registrado con ese email."**
2. Se rechaza el alta si el email no tiene un formato valido, con el mensaje
   **"El email no tiene un formato valido."**
3. Se rechaza el alta si la contrasena tiene menos de 4 caracteres, con el mensaje
   **"La contrasena debe tener al menos 4 caracteres."**
4. Se rechaza el alta si el nombre esta vacio, con el mensaje
   **"El nombre del usuario es obligatorio."**
5. Cuando el alta se rechaza, el usuario permanece en `/registro` y no queda ninguna sesion abierta.

### Casos de prueba

| ID | Tipo | Pasos | Resultado esperado |
| --- | --- | --- | --- |
| **CP-12** | Camino feliz | Abrir `/registro`, rellenar nombre `Cliente de prueba`, un email nuevo y la contrasena `cliente1234`, pulsar **Crear cuenta** | Redirige a `/`; la cabecera muestra el nombre y **Cerrar sesion**, sin el enlace **Usuarios**; la portada indica el rol de cliente |
| **CP-13** | Negativa | Repetir el alta con `ana@minimarket.com`, que ya existe | Permanece en `/registro` con el mensaje "Ya existe un usuario registrado con ese email."; al abrir `/` se vuelve al login |

---

## HU-07 — Iniciar y cerrar sesion con Better Auth

> **Como** responsable del minimarket
> **quiero** que las cuentas y las sesiones las gestione Better Auth
> **para** que las contrasenas queden cifradas y las sesiones se puedan revocar desde el servidor.

> **Epica:** E-02 · **Puntos de historia:** 5

### Criterios de aceptacion

1. El inicio de sesion se resuelve con `signInEmail` de Better Auth y crea una fila en la tabla
   `session`.
2. La cookie de sesion (`better-auth.session_token`) es `httpOnly` y caduca a los 7 dias.
3. La contrasena se comprueba contra el hash guardado en `account`; la base de datos no guarda
   ninguna contrasena en claro.
4. **Cerrar sesion** revoca la sesion en el servidor y borra la cookie.
5. El proxy (`src/proxy.ts`) comprueba de forma optimista la cookie y la verificacion definitiva se
   hace contra la base de datos en `src/lib/dal.ts`.

### Criterios de rechazo

1. Se rechaza el acceso si las credenciales no coinciden, con el mensaje **"Credenciales invalidas."**
2. Se rechaza el acceso a una cuenta bloqueada, aunque la contrasena sea correcta.
3. Una cookie manipulada o caducada no da acceso: la sesion se valida siempre contra la tabla
   `session`.
4. Ninguna ruta protegida se sirve sin sesion, ni por la interfaz ni por la API.

### Casos de prueba

| ID | Tipo | Pasos | Resultado esperado |
| --- | --- | --- | --- |
| **CP-01** | Camino feliz | Ver HU-01 | La sesion se crea con Better Auth y la cabecera muestra al usuario |
| **CP-02** | Negativa | Ver HU-01 | Mensaje "Credenciales invalidas." y ninguna sesion abierta |
| **CP-03** | Limites | Ver HU-01 | El formulario no se envia con los campos obligatorios vacios |

---

## HU-08 — Administrar usuarios y sus roles

> **Como** administradora del minimarket
> **quiero** dar de alta usuarios, cambiarles el rol y bloquearlos
> **para** controlar quien puede entrar y que puede hacer cada quien.
>
> **Epica:** E-02 · **Puntos de historia:** 8

### Criterios de aceptacion

1. La ruta `/usuarios` solo es accesible con rol **administrador**, y el enlace de la barra solo se
   muestra a ese rol.
2. La tabla lista **Nombre, Email, Rol, Estado, Registrado** y las acciones de cada fila.
3. La administracion puede crear un usuario indicando su rol (**Cliente** o **Administrador**).
4. La administracion puede editar nombre, email, rol y contrasena de cualquier cuenta; si deja la
   contrasena vacia, se conserva la actual.
5. La administracion puede **bloquear** y **desbloquear** cuentas; bloquear cierra las sesiones
   abiertas de esa cuenta.
6. La administracion puede eliminar cuentas.

### Criterios de rechazo

1. Se rechaza el acceso de un cliente a `/usuarios`, `/usuarios/nuevo` y `/usuarios/{id}/editar`:
   vuelve a la portada con el mensaje
   **"Necesitas permisos de administrador para entrar ahi."**
2. La API `/api/usuarios` responde **401** sin sesion y **403** con rol de cliente.
3. Se rechaza que la administracion se elimine o se bloquee a si misma.
4. Se rechazan los datos que incumplen las reglas de la cuenta, con los mismos mensajes de HU-06.

### Casos de prueba

| ID | Tipo | Pasos | Resultado esperado |
| --- | --- | --- | --- |
| **CP-14** | Negativa | Entrar como `carlos@minimarket.com` (cliente) y comprobar la barra; despues abrir a mano `/usuarios` y `/usuarios/nuevo` | La barra no ofrece **Usuarios**; ambas rutas devuelven a la portada con el mensaje "Necesitas permisos de administrador para entrar ahi." |

---

## HU-09 — Ver unicamente mis compras

> **Como** cliente del minimarket
> **quiero** ver solo las compras hechas con mi cuenta
> **para** que mi historial no quede a la vista de los demas clientes.
>
> **Epica:** E-02 · **Puntos de historia:** 5

### Criterios de aceptacion

1. Un cliente que abre `/compras` ve el titulo **Mis compras** y unicamente las filas cuyo usuario
   es el suyo.
2. La administracion ve el titulo **Compras**, todas las filas y una columna **Usuario** con el
   nombre y el correo de cada comprador.
3. Al registrar una compra, un cliente solo puede hacerlo a su nombre: el campo Usuario aparece
   fijado y de solo lectura.
4. La administracion si puede elegir a nombre de que usuario se registra la compra.
5. Anular una compra devuelve las unidades al stock del producto.

### Criterios de rechazo

1. Se rechaza que un cliente anule una compra que no es suya, con el mensaje
   **"Solo puedes anular tus propias compras."**
2. La API `/api/compras` devuelve unicamente las compras del usuario de la sesion cuando el rol es
   cliente.
3. Se rechaza el acceso a `/compras` sin sesion: redirige a `/login`.

### Casos de prueba

| ID | Tipo | Pasos | Resultado esperado |
| --- | --- | --- | --- |
| **CP-15** | Camino feliz | Entrar como cliente y abrir `/compras`; despues repetir como administradora | El cliente ve **Mis compras** con una sola fila (`Pan de molde`) y sin rastro de la compra ni del correo de la otra cuenta; la administradora ve las dos filas y la columna Usuario |

---

## HU-10 — Solo la administracion modifica el catalogo

> **Como** responsable del minimarket
> **quiero** que unicamente la administracion pueda crear, editar y eliminar productos
> **para** que un cliente no pueda alterar el inventario.
>
> **Epica:** E-02 · **Puntos de historia:** 5

### Criterios de aceptacion

1. Cualquier sesion puede consultar el catalogo en `/productos`.
2. Para un cliente, la tabla se muestra sin la columna **Acciones** y sin el boton
   **Nuevo producto**.
3. Para la administracion, la tabla mantiene la columna **Acciones** con **Editar** y **Eliminar**.
4. La API `GET /api/productos` esta disponible para cualquier sesion.

### Criterios de rechazo

1. Se rechaza el acceso de un cliente a `/productos/nuevo` y `/productos/{id}/editar`: vuelve a la
   portada con el mensaje **"Necesitas permisos de administrador para entrar ahi."**
2. La API responde **403** a un cliente en `POST`, `PUT` y `DELETE` sobre `/api/productos`.
3. La API responde **401** a cualquier peticion sin sesion.
4. Las server actions de alta, edicion y borrado comprueban el rol, no solo las pantallas.

### Casos de prueba

| ID | Tipo | Pasos | Resultado esperado |
| --- | --- | --- | --- |
| **CP-16** | Negativa | Entrar como cliente, abrir `/productos` y despues `/productos/nuevo` a mano | La tabla tiene cuatro columnas, sin **Nuevo producto**, **Editar** ni **Eliminar**; `/productos/nuevo` devuelve a la portada con el aviso de permisos |

---

## Trazabilidad

| Caso | Historia | Tipo | Archivo |
| --- | --- | --- | --- |
| CP-01 | HU-01, HU-07 | Camino feliz | `tests-selenium/01-login.spec.js` |
| CP-02 | HU-01, HU-07 | Negativa | `tests-selenium/01-login.spec.js` |
| CP-03 | HU-01, HU-07 | Limites | `tests-selenium/01-login.spec.js` |
| CP-04 | HU-02 | Camino feliz | `tests-selenium/02-crear-producto.spec.js` |
| CP-05 | HU-02 | Negativa | `tests-selenium/02-crear-producto.spec.js` |
| CP-06 | HU-02 | Limites | `tests-selenium/02-crear-producto.spec.js` |
| CP-07 | HU-03 | Camino feliz | `tests-selenium/03-listar-productos.spec.js` |
| CP-08 | HU-03 | Negativa | `tests-selenium/03-listar-productos.spec.js` |
| CP-09 | HU-04 | Camino feliz | `tests-selenium/04-editar-producto.spec.js` |
| CP-10 | HU-04 | Negativa | `tests-selenium/04-editar-producto.spec.js` |
| CP-11 | HU-05 | Camino feliz | `tests-selenium/05-eliminar-producto.spec.js` |
| CP-12 | HU-06 | Camino feliz | `tests-selenium/06-registro.spec.js` |
| CP-13 | HU-06 | Negativa | `tests-selenium/06-registro.spec.js` |
| CP-14 | HU-08 | Negativa | `tests-selenium/07-roles-y-permisos.spec.js` |
| CP-15 | HU-09 | Camino feliz | `tests-selenium/08-mis-compras.spec.js` |
| CP-16 | HU-10 | Negativa | `tests-selenium/07-roles-y-permisos.spec.js` |

## Evidencias

- **Reporte HTML**: `tests-selenium/reportes/reporte.html` (generado por mochawesome).
- **Capturas automaticas**: `tests-selenium/reportes/capturas/`, una por caso de prueba, tomadas
  pase o falle el caso y adjuntas al reporte.

## Como ejecutar las pruebas

```bash
npm install
cp .env.example .env      # ajusta BETTER_AUTH_SECRET
npm run db:migrate
npm run db:seed
npm run dev               # en una terminal, deja la app en http://localhost:3000

npm run test:e2e          # en otra terminal
```

Las pruebas dejan la base de datos en un estado conocido ejecutando el seed antes de empezar, y
abren un navegador limpio en cada caso para que ninguna sesion se filtre de una prueba a otra.
