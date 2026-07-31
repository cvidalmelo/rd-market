import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx ./prisma/seed.ts",
  },
  datasource: {
    // Mismo valor por defecto que src/lib/prisma.ts, para que `prisma generate`
    // funcione en un clon recien descargado que todavia no tiene su archivo .env.
    url: process.env.DATABASE_URL ?? "file:./dev.db",
  },
});
