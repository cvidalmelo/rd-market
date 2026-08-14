"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cerrarSesionAction } from "@/app/login/actions";
import { botonPeligro } from "@/components/ui";
import { esAdmin } from "@/lib/roles";

const enlaces = [
  { href: "/", texto: "Inicio", soloAdmin: false },
  { href: "/productos", texto: "Productos", soloAdmin: false },
  { href: "/usuarios", texto: "Usuarios", soloAdmin: true },
  { href: "/compras", texto: "Compras", soloAdmin: false },
];

type Props = { usuario?: { name: string; role?: string | null } | null };

export default function NavBar({ usuario }: Props) {
  const ruta = usePathname();

  // Sin sesion solo se ve la pantalla de login: no hay nada que navegar.
  if (!usuario) {
    return null;
  }

  const administrador = esAdmin(usuario);
  const visibles = enlaces.filter((enlace) => !enlace.soloAdmin || administrador);

  return (
    <div className="flex flex-wrap items-center gap-4">
      <nav className="flex flex-wrap gap-1">
        {visibles.map((enlace) => {
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
        <span className="text-slate-600">Hola, {usuario.name}</span>
        <form action={cerrarSesionAction}>
          <button type="submit" className={botonPeligro}>
            Cerrar sesion
          </button>
        </form>
      </div>
    </div>
  );
}
