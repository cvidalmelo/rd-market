import Link from "next/link";
import { contarCompras } from "@/lib/compras";
import { contarProductos } from "@/lib/productos";
import { contarUsuarios } from "@/lib/usuarios";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [productos, usuarios, compras] = await Promise.all([
    contarProductos(),
    contarUsuarios(),
    contarCompras(),
  ]);

  const secciones = [
    {
      href: "/productos",
      titulo: "Productos",
      total: productos,
      detalle: "Alta, edicion y baja del catalogo",
    },
    {
      href: "/usuarios",
      titulo: "Usuarios",
      total: usuarios,
      detalle: "Registro y administracion de clientes",
    },
    {
      href: "/compras",
      titulo: "Compras",
      total: compras,
      detalle: "Productos adquiridos por cada usuario",
    },
  ];

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
        Proyecto universitario
      </p>
      <h1 className="mt-2 text-2xl font-semibold">MiniMarket</h1>
      <p className="mt-3 max-w-prose text-sm text-slate-600">
        Aplicacion CRUD de productos, usuarios y compras construida con Next.js, Prisma y
        SQLite.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {secciones.map((seccion) => (
          <Link
            key={seccion.href}
            href={seccion.href}
            className="rounded border border-slate-200 bg-white p-5 transition hover:border-slate-400"
          >
            <p className="text-3xl font-semibold">{seccion.total}</p>
            <p className="mt-1 font-medium">{seccion.titulo}</p>
            <p className="mt-1 text-xs text-slate-500">{seccion.detalle}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
