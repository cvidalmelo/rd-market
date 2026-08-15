import Link from "next/link";
import MensajeError from "@/components/MensajeError";
import { contarCompras } from "@/lib/compras";
import { exigirUsuario } from "@/lib/dal";
import { contarProductos } from "@/lib/productos";
import { esAdmin } from "@/lib/roles";
import { contarUsuarios } from "@/lib/usuarios";

export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<{ error?: string }> };

export default async function Home({ searchParams }: Props) {
  const { error } = await searchParams;
  const usuario = await exigirUsuario();
  const administrador = esAdmin(usuario);

  const [productos, usuarios, compras] = await Promise.all([
    contarProductos(),
    administrador ? contarUsuarios() : Promise.resolve(0),
    contarCompras(usuario),
  ]);

  const secciones = [
    {
      href: "/productos",
      titulo: "Productos",
      total: productos,
      detalle: administrador
        ? "Alta, edicion y baja del catalogo"
        : "Catalogo disponible en la tienda",
      visible: true,
    },
    {
      href: "/usuarios",
      titulo: "Usuarios",
      total: usuarios,
      detalle: "Registro, roles y bloqueo de cuentas",
      visible: administrador,
    },
    {
      href: "/compras",
      titulo: administrador ? "Compras" : "Mis compras",
      total: compras,
      detalle: administrador
        ? "Productos adquiridos por cada usuario"
        : "Productos que has adquirido",
      visible: true,
    },
  ].filter((seccion) => seccion.visible);

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
        Proyecto universitario
      </p>
      <h1 className="mt-2 text-2xl font-semibold">MiniMarket</h1>
      <p className="mt-3 max-w-prose text-sm text-slate-600">
        Aplicacion CRUD de productos, usuarios y compras construida con Next.js, Prisma y
        SQLite, con autenticacion y roles gestionados por Better Auth.
      </p>

      <p className="mt-2 text-sm text-slate-600">
        Sesion iniciada como <span className="font-medium">{usuario.name}</span> con el rol
        de {administrador ? "administrador" : "cliente"}.
      </p>

      <div className="mt-6">
        <MensajeError mensaje={error} />
      </div>

      <div className="mt-2 grid gap-4 sm:grid-cols-3">
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
