# MiniMarket

Aplicacion CRUD de un mini mercado desarrollada como trabajo universitario. Permite
administrar un catalogo de productos, registrar usuarios y dejar constancia de las
compras que cada usuario realiza, descontando el stock correspondiente.

## Funcionalidad

- **Productos**: crear, listar, editar y eliminar (nombre, descripcion, precio, stock y categoria).
- **Usuarios**: crear, listar, editar y eliminar (nombre, email unico y contrasena).
- **Compras**: un usuario adquiere un producto en una cantidad determinada. La compra y el
  descuento de stock ocurren dentro de una misma transaccion, y anular una compra devuelve
  las unidades al stock.
- **Validaciones**: campos obligatorios, precio y stock no negativos, stock entero, email
  con formato valido y sin duplicados, y cantidad de compra limitada al stock disponible.

## Stack

- [Next.js 16](https://nextjs.org) con App Router y TypeScript
- [Prisma 7](https://www.prisma.io) como ORM
- SQLite como base de datos local (archivo `dev.db`, sin servidor externo)
- [Tailwind CSS 4](https://tailwindcss.com) para los estilos

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

## Scripts

| Script | Descripcion |
| --- | --- |
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de produccion |
| `npm run start` | Servidor de produccion |
| `npm run db:migrate` | Aplica las migraciones de Prisma |
| `npm run db:seed` | Carga datos de ejemplo |
| `npm run db:generate` | Regenera el cliente de Prisma |

## Estructura

```
prisma/
  schema.prisma          Modelos Producto, Usuario y Compra
  migrations/            Historial de migraciones
  seed.ts                Datos de ejemplo
src/
  app/
    productos/           Paginas y Server Actions de productos
    usuarios/            Paginas y Server Actions de usuarios
    compras/             Paginas y Server Actions de compras
    api/                 Endpoints REST de cada modulo
  components/            Barra de navegacion y estilos compartidos
  lib/                   Acceso a datos, validaciones y cliente de Prisma
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

model Usuario {
  id       String   @id @default(cuid())
  nombre   String
  email    String   @unique
  password String
  creadoEn DateTime @default(now())
  compras  Compra[]
}

model Compra {
  id         String   @id @default(cuid())
  usuarioId  String
  productoId String
  cantidad   Int
  fecha      DateTime @default(now())
  usuario    Usuario  @relation(fields: [usuarioId], references: [id], onDelete: Cascade)
  producto   Producto @relation(fields: [productoId], references: [id], onDelete: Cascade)
}
```

Eliminar un usuario o un producto borra en cascada sus compras asociadas.

## Endpoints REST

| Metodo | Ruta | Descripcion |
| --- | --- | --- |
| GET / POST | `/api/productos` | Listar y crear productos |
| GET / PUT / DELETE | `/api/productos/[id]` | Consultar, editar y eliminar un producto |
| GET / POST | `/api/usuarios` | Listar y crear usuarios |
| GET / PUT / DELETE | `/api/usuarios/[id]` | Consultar, editar y eliminar un usuario |
| GET / POST | `/api/compras` | Listar y registrar compras |
| DELETE | `/api/compras/[id]` | Anular una compra y devolver el stock |

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
feature/validaciones-y-documentacion  ─┘
```

| Rama | Contenido |
| --- | --- |
| `feature/setup-proyecto-base` | Configuracion de Next.js, Prisma, SQLite y Tailwind |
| `feature/crud-productos` | Modelo Producto, endpoints y paginas |
| `feature/crud-usuarios` | Modelo Usuario, endpoints y paginas |
| `feature/modulo-compras` | Modelo Compra y descuento de stock transaccional |
| `feature/ui-navegacion` | Layout, navegacion y estilos compartidos |
| `feature/validaciones-y-documentacion` | Validaciones, datos de ejemplo y documentacion |

## Nota academica

Las contrasenas se guardan en texto plano de forma intencional: el trabajo se centra en el
CRUD y en el flujo de trabajo con Git, y no incluye autenticacion. En una aplicacion real
habria que almacenar unicamente el hash de la contrasena.
