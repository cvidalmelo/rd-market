"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const enlaces = [
  { href: "/", texto: "Inicio" },
  { href: "/productos", texto: "Productos" },
  { href: "/usuarios", texto: "Usuarios" },
  { href: "/compras", texto: "Compras" },
];

export default function NavBar() {
  const ruta = usePathname();

  return (
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
  );
}
