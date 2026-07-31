import Link from "next/link";
import {
  botonPeligro,
  botonPrimario,
  celda,
  contenedorTabla,
  encabezadoTabla,
  fila,
  tabla,
  textoVacio,
  titulo,
} from "@/components/ui";
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
        <h1 className={titulo}>Compras</h1>
        <Link href="/compras/nueva" className={botonPrimario}>
          Nueva compra
        </Link>
      </div>

      {compras.length === 0 ? (
        <p className={textoVacio}>Todavia no se registraron compras.</p>
      ) : (
        <div className={contenedorTabla}>
          <table className={tabla}>
            <thead className={encabezadoTabla}>
              <tr>
                <th className={celda}>Usuario</th>
                <th className={celda}>Producto</th>
                <th className={celda}>Cantidad</th>
                <th className={celda}>Total</th>
                <th className={celda}>Fecha</th>
                <th className={`${celda} text-right`}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {compras.map((compra) => (
                <tr key={compra.id} className={fila}>
                  <td className={celda}>
                    <span className="font-medium">{compra.usuario.nombre}</span>
                    <p className="text-xs text-slate-500">{compra.usuario.email}</p>
                  </td>
                  <td className={celda}>{compra.producto.nombre}</td>
                  <td className={celda}>{compra.cantidad}</td>
                  <td className={celda}>
                    ${(compra.producto.precio * compra.cantidad).toFixed(2)}
                  </td>
                  <td className={celda}>{formatoFecha.format(compra.fecha)}</td>
                  <td className={celda}>
                    <div className="flex justify-end">
                      <form action={eliminarCompraAction}>
                        <input type="hidden" name="id" value={compra.id} />
                        <button type="submit" className={botonPeligro}>
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
