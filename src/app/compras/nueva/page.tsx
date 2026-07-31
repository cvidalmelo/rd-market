import Link from "next/link";
import { listarProductos } from "@/lib/productos";
import { listarUsuarios } from "@/lib/usuarios";
import { crearCompraAction } from "../actions";

export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<{ error?: string }> };

const campo =
  "mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none";
const etiqueta = "block text-sm font-medium text-slate-700";

export default async function NuevaCompraPage({ searchParams }: Props) {
  const { error } = await searchParams;
  const [usuarios, productos] = await Promise.all([listarUsuarios(), listarProductos()]);
  const disponibles = productos.filter((producto) => producto.stock > 0);

  return (
    <div>
      <h1 className="mb-6 text-xl font-semibold">Nueva compra</h1>

      {error ? (
        <p className="mb-4 max-w-lg rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      {usuarios.length === 0 || disponibles.length === 0 ? (
        <p className="text-sm text-slate-600">
          Para registrar una compra necesitas al menos un usuario y un producto con stock
          disponible.
        </p>
      ) : (
        <form action={crearCompraAction} className="max-w-lg space-y-4">
          <div>
            <label className={etiqueta} htmlFor="usuarioId">
              Usuario
            </label>
            <select id="usuarioId" name="usuarioId" className={campo}>
              {usuarios.map((usuario) => (
                <option key={usuario.id} value={usuario.id}>
                  {usuario.nombre} ({usuario.email})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={etiqueta} htmlFor="productoId">
              Producto
            </label>
            <select id="productoId" name="productoId" className={campo}>
              {disponibles.map((producto) => (
                <option key={producto.id} value={producto.id}>
                  {producto.nombre} - ${producto.precio.toFixed(2)} ({producto.stock} en
                  stock)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={etiqueta} htmlFor="cantidad">
              Cantidad
            </label>
            <input
              id="cantidad"
              name="cantidad"
              type="number"
              min="1"
              defaultValue={1}
              className={campo}
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              className="rounded bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
            >
              Registrar compra
            </button>
            <Link href="/compras" className="text-sm text-slate-600 hover:underline">
              Cancelar
            </Link>
          </div>
        </form>
      )}
    </div>
  );
}
