import type { Metadata } from "next";
import Link from "next/link";
import NavBar from "@/components/NavBar";
import { obtenerUsuarioActual } from "@/lib/dal";
import "./globals.css";

export const metadata: Metadata = {
  title: "MiniMarket",
  description: "CRUD de productos, usuarios y compras",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const usuario = await obtenerUsuarioActual();

  return (
    <html lang="es">
      <body>
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-6 py-4">
            <Link href="/" className="text-lg font-semibold">
              MiniMarket
            </Link>
            <NavBar usuario={usuario} />
          </div>
        </header>

        <main className="mx-auto max-w-5xl px-6 py-10">{children}</main>

        <footer className="mx-auto max-w-5xl px-6 pb-10 text-xs text-slate-500">
          Proyecto universitario - Next.js, Prisma y SQLite
        </footer>
      </body>
    </html>
  );
}
