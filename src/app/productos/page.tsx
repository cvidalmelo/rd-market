import Link from "next/link";
import { listarProductos } from "@/lib/productos";
import { eliminarProductoAction } from "./actions";

export const dynamic = "force-dynamic";

export default async function ProductosPage() {
  const productos = await listarProductos();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Productos</h1>
        <Link
          href="/productos/nuevo"
          className="rounded bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
        >
          Nuevo producto
        </Link>
      </div>

      {productos.length === 0 ? (
        <p className="text-sm text-slate-600">Todavia no hay productos registrados.</p>
      ) : (
        <div className="overflow-x-auto rounded border border-slate-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-100 text-xs uppercase text-slate-600">
              <tr>
                <th className="px-4 py-3">Nombre</th>
                <th className="px-4 py-3">Categoria</th>
                <th className="px-4 py-3">Precio</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((producto) => (
                <tr key={producto.id} className="border-b border-slate-100 last:border-0">
                  <td className="px-4 py-3">
                    <span className="font-medium">{producto.nombre}</span>
                    {producto.descripcion ? (
                      <p className="text-xs text-slate-500">{producto.descripcion}</p>
                    ) : null}
                  </td>
                  <td className="px-4 py-3">{producto.categoria ?? "-"}</td>
                  <td className="px-4 py-3">${producto.precio.toFixed(2)}</td>
                  <td className="px-4 py-3">{producto.stock}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-3">
                      <Link
                        href={`/productos/${producto.id}/editar`}
                        className="text-slate-700 hover:underline"
                      >
                        Editar
                      </Link>
                      <form action={eliminarProductoAction}>
                        <input type="hidden" name="id" value={producto.id} />
                        <button type="submit" className="text-red-600 hover:underline">
                          Eliminar
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
