"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cerrarSesionAction } from "@/app/login/actions";
import { botonPeligro } from "@/components/ui";

const enlaces = [
  { href: "/", texto: "Inicio" },
  { href: "/productos", texto: "Productos" },
  { href: "/usuarios", texto: "Usuarios" },
  { href: "/compras", texto: "Compras" },
];

type Props = { usuario?: { nombre: string } | null };

export default function NavBar({ usuario }: Props) {
  const ruta = usePathname();

  // Sin sesion solo se ve la pantalla de login: no hay nada que navegar.
  if (!usuario) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-4">
      <nav className="flex flex-wrap gap-1">
        {enlaces.map((enlace) => {
          const activo =
            enlace.href === "/" ? ruta === "/" : ruta.startsWith(enlace.href);

          return (
            <Link
              key={enlace.href}
              href={enlace.href}
              className={`rounded px-3 py-1.5 text-sm transition ${
                activo
                  ? "bg-slate-900 font-medium text-white"
                  : "text-slate-600 hover:bg-slate-200"
              }`}
            >
              {enlace.texto}
            </Link>
          );
        })}
      </nav>

      <div className="flex items-center gap-3 text-sm">
        <span className="text-slate-600">Hola, {usuario.nombre}</span>
        <form action={cerrarSesionAction}>
          <button type="submit" className={botonPeligro}>
            Cerrar sesion
          </button>
        </form>
      </div>
    </div>
  );
}
