# MiniMarket

Aplicacion CRUD de un mini mercado desarrollada como trabajo universitario. Permite
administrar un catalogo de productos, registrar usuarios y dejar constancia de las
compras que cada usuario realiza, descontando el stock correspondiente. El acceso se
gestiona con **Better Auth** y hay dos roles: **administrador** y **cliente**.

## Funcionalidad

- **Cuentas y sesion**: registro publico en `/registro` e inicio de sesion con email y
  contrasena mediante Better Auth. La contrasena se guarda cifrada (scrypt) y la sesion vive
  en la base de datos, de modo que se puede revocar desde el servidor.
- **Roles**: las cuentas nuevas nacen como **cliente**; el rol **administrador** se asigna desde
  la seccion de usuarios.
- **Productos**: cualquier sesion consulta el catalogo; solo la administracion crea, edita y
  elimina (nombre, descripcion, precio, stock y categoria).
- **Usuarios**: seccion exclusiva de la administracion. Permite crear cuentas, editarlas,
  cambiarles el rol, bloquearlas y eliminarlas.
- **Compras**: cada cliente ve y anula unicamente las suyas; la administracion ve las de todos.
  La compra y el descuento de stock ocurren dentro de una misma transaccion, y anular una
  compra devuelve las unidades al stock.
- **Validaciones**: campos obligatorios, precio y stock no negativos, stock entero, email
  con formato valido y sin duplicados, y cantidad de compra limitada al stock disponible.

## Stack

- [Next.js 16](https://nextjs.org) con App Router y TypeScript
- [Prisma 7](https://www.prisma.io) como ORM
- SQLite como base de datos local (archivo `dev.db`, sin servidor externo)
- [Tailwind CSS 4](https://tailwindcss.com) para los estilos
- [Better Auth](https://better-auth.com) con su plugin `admin` para la autenticacion y los roles
- [Selenium WebDriver](https://www.selenium.dev) con Mocha y mochawesome para las pruebas E2E

## Instalacion

Requiere Node.js 20 o superior.

```bash
git clone https://github.com/cvidalmelo/rd-market.git
cd rd-market
npm install
cp .env.example .env
npm run db:migrate
npm run db:seed     # opcional: carga datos de ejemplo
npm run dev
```

La aplicacion queda disponible en http://localhost:3000

> `npm install` ejecuta `prisma generate` automaticamente, porque el cliente generado
> (`src/generated`) no se versiona en el repositorio.

El archivo `.env` necesita tres variables: `DATABASE_URL`, `BETTER_AUTH_URL` (la direccion base
de la aplicacion) y `BETTER_AUTH_SECRET` (la clave con la que Better Auth firma las sesiones; se
genera con `openssl rand -base64 32`).

### Credenciales de ejemplo

`npm run db:seed` deja estas cuentas listas para entrar, con la contrasena ya cifrada:

| Email | Contrasena | Rol |
| --- | --- | --- |
| `ana@minimarket.com` | `ana1234` | Administrador |
| `carlos@minimarket.com` | `carlos1234` | Cliente |

## Scripts

| Script | Descripcion |
| --- | --- |
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de produccion |
| `npm run start` | Servidor de produccion |
| `npm run db:migrate` | Aplica las migraciones de Prisma |
| `npm run db:seed` | Carga datos de ejemplo |
| `npm run db:generate` | Regenera el cliente de Prisma |
| `npm run test:e2e` | Pruebas automatizadas con Selenium |
| `npm run test:e2e:headless` | Igual, pero sin abrir la ventana del navegador |

## Estructura

```
docs/
  historias-usuario.md   Las diez historias con sus criterios y puntos
  proyecto-final.md      Planificacion, Scrum y plan de pruebas
  proyecto-final.pdf     El mismo documento con el formato de entrega
prisma/
  schema.prisma          Modelos de Better Auth mas Producto y Compra
  migrations/            Historial de migraciones
  seed.ts                Datos de ejemplo
src/
  app/
    login/               Pagina de acceso y Server Actions de sesion
    registro/            Alta publica de cuentas
    productos/           Paginas y Server Actions de productos
    usuarios/            Paginas y Server Actions de usuarios
    compras/             Paginas y Server Actions de compras
    api/                 Endpoints REST de cada modulo y de Better Auth
  components/            Barra de navegacion y estilos compartidos
  lib/                   Better Auth, roles, acceso a datos y validaciones
  proxy.ts               Proteccion de rutas (el antiguo middleware de Next)
tests-selenium/
  paginas/               Page Objects
  soporte/               Navegador, hooks globales y capturas
  *.spec.js              Un archivo por historia de usuario
  reportes/              Reporte HTML y capturas generadas
```

Las paginas y los endpoints REST comparten la misma capa de `src/lib`, de modo que las
validaciones se aplican por igual desde el formulario y desde la API.

## Modelo de datos

```prisma
model Producto {
  id          String   @id @default(cuid())
  nombre      String
  descripcion String?
  precio      Float
  stock       Int
  categoria   String?
  creadoEn    DateTime @default(now())
  compras     Compra[]
}

// Better Auth administra `User`, `Session`, `Account` y `Verification`.
// Los campos role, banned, banReason y banExpires los aporta su plugin admin.
model User {
  id            String    @id
  name          String
  email         String    @unique
  emailVerified Boolean   @default(false)
  image         String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  role          String?
  banned        Boolean?  @default(false)
  banReason     String?
  banExpires    DateTime?
  sessions      Session[]
  accounts      Account[]
  compras       Compra[]
}

model Compra {
  id         String   @id @default(cuid())
  usuarioId  String
  productoId String
  cantidad   Int
  fecha      DateTime @default(now())
  usuario    User     @relation(fields: [usuarioId], references: [id], onDelete: Cascade)
  producto   Producto @relation(fields: [productoId], references: [id], onDelete: Cascade)
}
```

Eliminar un usuario o un producto borra en cascada sus compras asociadas. La contrasena no vive
en `User` sino cifrada en `Account`, que es donde Better Auth guarda las credenciales.

## Endpoints REST

| Metodo | Ruta | Descripcion | Permiso |
| --- | --- | --- | --- |
| GET | `/api/productos` | Listar productos | Cualquier sesion |
| POST | `/api/productos` | Crear un producto | Administrador |
| GET | `/api/productos/[id]` | Consultar un producto | Cualquier sesion |
| PUT / DELETE | `/api/productos/[id]` | Editar y eliminar un producto | Administrador |
| GET / POST | `/api/usuarios` | Listar y crear usuarios | Administrador |
| GET / PUT / DELETE | `/api/usuarios/[id]` | Consultar, editar y eliminar un usuario | Administrador |
| GET / POST | `/api/compras` | Listar y registrar compras | Cualquier sesion (filtrado por usuario) |
| DELETE | `/api/compras/[id]` | Anular una compra y devolver el stock | Propietario o administrador |
| GET / POST | `/api/auth/*` | Endpoints de Better Auth | Publico |

Cada route handler comprueba su propia sesion y su rol con los ayudantes de `src/lib/api-auth.ts`:
sin sesion responde **401** y con un rol insuficiente responde **403**.

## Autenticacion y proteccion de rutas

La autenticacion la resuelve [Better Auth](https://better-auth.com) con email y contrasena, y su
plugin `admin` aporta los roles:

- `src/lib/auth.ts` configura la instancia: adaptador de Prisma sobre SQLite, el plugin `admin`
  (roles `admin` y `user`) y `nextCookies`, que permite escribir la cookie desde las server actions.
- `src/app/api/auth/[...all]/route.ts` monta los endpoints de Better Auth.
- `src/lib/sesion.ts` envuelve `signInEmail`, `signUpEmail` y `signOut`, traduciendo sus errores a
  los mensajes de la aplicacion.
- `src/lib/dal.ts` es la capa de acceso a datos: valida la sesion contra la tabla `session` y
  expone `exigirUsuario()` y `exigirAdmin()`.
- `src/lib/api-auth.ts` hace lo propio para los route handlers, devolviendo 401 y 403.
- `src/proxy.ts` hace la comprobacion optimista de la cookie y redirige a `/login` sin consultar la
  base de datos. En Next 16 este archivo sustituye al antiguo `middleware.ts`.

La autorizacion se comprueba en tres capas —pagina, server action y route handler—, de modo que
ocultar un boton nunca es el unico obstaculo.

## Pruebas automatizadas

Las pruebas end-to-end usan Selenium WebDriver con Mocha y generan un reporte HTML con capturas
de pantalla de cada caso.

```bash
npm run dev        # en una terminal
npm run test:e2e   # en otra
```

- Cubren **10 historias de usuario** y **16 casos**: camino feliz, pruebas negativas y pruebas de
  limites sobre la autenticacion, el registro, los permisos por rol y el CRUD de productos.
- Antes de empezar se ejecuta el seed, de modo que la base de datos siempre parte del mismo estado.
- Cada caso abre un navegador limpio, asi ninguna sesion se filtra de una prueba a la siguiente.
- Resultados en `tests-selenium/reportes/reporte.html` y capturas en
  `tests-selenium/reportes/capturas/`.
- Las historias, con sus criterios de aceptacion y rechazo, estan en
  [`docs/historias-usuario.md`](docs/historias-usuario.md).
- La planificacion, la gestion Scrum y el plan de pruebas completos estan en
  [`docs/proyecto-final.md`](docs/proyecto-final.md) y en su version en PDF.

## Flujo de ramas

El repositorio mantiene tres ramas permanentes (`main`, `development` y `qa`). Cada
funcionalidad se desarrollo en su propia rama a partir de `development` y se integro
mediante un Pull Request; luego los cambios se promovieron a `qa` y finalmente a `main`.

```
feature/setup-proyecto-base           ─┐
feature/crud-productos                 │
feature/crud-usuarios                  ├──► development ──► qa ──► main
feature/modulo-compras                 │
feature/ui-navegacion                  │
feature/validaciones-y-documentacion   │
feature/pruebas-selenium               │
feature/better-auth-migracion          │
feature/roles-y-admin                  │
feature/pruebas-better-auth            │
feature/documentacion-proyecto-final  ─┘
```

| Rama | Contenido |
| --- | --- |
| `feature/setup-proyecto-base` | Configuracion de Next.js, Prisma, SQLite y Tailwind |
| `feature/crud-productos` | Modelo Producto, endpoints y paginas |
| `feature/crud-usuarios` | Modelo Usuario, endpoints y paginas |
| `feature/modulo-compras` | Modelo Compra y descuento de stock transaccional |
| `feature/ui-navegacion` | Layout, navegacion y estilos compartidos |
| `feature/validaciones-y-documentacion` | Validaciones, datos de ejemplo y documentacion |
| `feature/pruebas-selenium` | Inicio de sesion y pruebas automatizadas con Selenium |
| `feature/better-auth-migracion` | Migracion de la autenticacion a Better Auth |
| `feature/roles-y-admin` | Roles, administracion de usuarios y proteccion de la API |
| `feature/pruebas-better-auth` | Ampliacion de la suite a dieciseis casos |
| `feature/documentacion-proyecto-final` | Documento del proyecto final y actualizacion del README |

## Documentacion

| Documento | Contenido |
| --- | --- |
| [`docs/proyecto-final.md`](docs/proyecto-final.md) | Planificacion, metodologia Scrum y plan de pruebas |
| `docs/proyecto-final.pdf` | El mismo documento con el formato de entrega |
| [`docs/historias-usuario.md`](docs/historias-usuario.md) | Las diez historias con sus criterios y puntos |

## Nota academica

Las contrasenas ya no se guardan en texto plano: desde la migracion a Better Auth se almacena
unicamente su hash (scrypt) en la tabla `account`. Lo que si sigue siendo una simplificacion
deliberada es la base de datos: SQLite en un archivo local, sin despliegue ni servidor externo,
porque el trabajo se centra en el CRUD, en el flujo con Git y en la automatizacion de pruebas.
