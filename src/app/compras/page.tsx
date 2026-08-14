import Link from "next/link";
import MensajeError from "@/components/MensajeError";
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
import { exigirUsuario } from "@/lib/dal";
import { esAdmin } from "@/lib/roles";
import { eliminarCompraAction } from "./actions";

export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<{ error?: string }> };

export default async function ComprasPage({ searchParams }: Props) {
  const { error } = await searchParams;
  const usuario = await exigirUsuario();
  const administrador = esAdmin(usuario);
  const compras = await listarCompras(usuario);
  const formatoFecha = new Intl.DateTimeFormat("es", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className={titulo}>{administrador ? "Compras" : "Mis compras"}</h1>
        <Link href="/compras/nueva" className={botonPrimario}>
          Nueva compra
        </Link>
      </div>

      <MensajeError mensaje={error} />

      {compras.length === 0 ? (
        <p className={textoVacio}>Todavia no se registraron compras.</p>
      ) : (
        <div className={contenedorTabla}>
          <table className={tabla}>
            <thead className={encabezadoTabla}>
              <tr>
                {administrador ? <th className={celda}>Usuario</th> : null}
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
                  {administrador ? (
                    <td className={celda}>
                      <span className="font-medium">{compra.usuario.name}</span>
                      <p className="text-xs text-slate-500">{compra.usuario.email}</p>
                    </td>
                  ) : null}
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
        {administrador
          ? "Como administradora ves las compras de todos los clientes. Anular una compra devuelve las unidades al stock del producto."
          : "Solo ves las compras hechas con tu cuenta. Anular una compra devuelve las unidades al stock del producto."}
      </p>
    </div>
  );
}
