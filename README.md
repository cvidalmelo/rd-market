# MiniMarket

Aplicacion CRUD de productos, usuarios y compras desarrollada como trabajo universitario.

## Stack

- Next.js 16 (App Router) con TypeScript
- Prisma 7 como ORM
- SQLite como base de datos local
- Tailwind CSS para los estilos

## Como correrlo

```bash
npm install
cp .env.example .env
npm run db:migrate
npm run dev
```

La aplicacion queda disponible en http://localhost:3000

## Scripts

- `npm run dev` - servidor de desarrollo
- `npm run build` - build de produccion
- `npm run start` - servidor de produccion
- `npm run db:migrate` - aplica las migraciones de Prisma
- `npm run db:seed` - carga datos de ejemplo
- `npm run db:generate` - regenera el cliente de Prisma
