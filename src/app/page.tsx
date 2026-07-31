import Link from "next/link";

export default function Home() {
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
      <Link
        href="/productos"
        className="mt-6 inline-block rounded bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
      >
        Ver productos
      </Link>
    </div>
  );
}
