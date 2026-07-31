import Link from "next/link";
import { listarCompras } from "@/lib/compras";
import { eliminarCompraAction } from "./actions";

export const dynamic = "force-dynamic";

export default async function ComprasPage() {
  const compras = await listarCompras();
  const formatoFecha = new Intl.DateTimeFormat("es", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Compras</h1>
        <Link
          href="/compras/nueva"
          className="rounded bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
        >
          Nueva compra
        </Link>
      </div>

      {compras.length === 0 ? (
        <p className="text-sm text-slate-600">Todavia no se registraron compras.</p>
      ) : (
        <div className="overflow-x-auto rounded border border-slate-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-100 text-xs uppercase text-slate-600">
              <tr>
                <th className="px-4 py-3">Usuario</th>
                <th className="px-4 py-3">Producto</th>
                <th className="px-4 py-3">Cantidad</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Fecha</th>
                <th className="px-4 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {compras.map((compra) => (
                <tr key={compra.id} className="border-b border-slate-100 last:border-0">
                  <td className="px-4 py-3">
                    <span className="font-medium">{compra.usuario.nombre}</span>
                    <p className="text-xs text-slate-500">{compra.usuario.email}</p>
                  </td>
                  <td className="px-4 py-3">{compra.producto.nombre}</td>
                  <td className="px-4 py-3">{compra.cantidad}</td>
                  <td className="px-4 py-3">
                    ${(compra.producto.precio * compra.cantidad).toFixed(2)}
                  </td>
                  <td className="px-4 py-3">{formatoFecha.format(compra.fecha)}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end">
                      <form action={eliminarCompraAction}>
                        <input type="hidden" name="id" value={compra.id} />
                        <button type="submit" className="text-red-600 hover:underline">
                          Anular
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

      <p className="mt-4 text-xs text-slate-500">
        Anular una compra devuelve las unidades al stock del producto.
      </p>
    </div>
  );
}
