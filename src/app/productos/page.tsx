import Link from "next/link";
import MensajeError from "@/components/MensajeError";
import {
  botonPeligro,
  botonPrimario,
  celda,
  contenedorTabla,
  encabezadoTabla,
  enlaceAccion,
  fila,
  tabla,
  textoVacio,
  titulo,
} from "@/components/ui";
import { exigirUsuario } from "@/lib/dal";
import { listarProductos } from "@/lib/productos";
import { esAdmin } from "@/lib/roles";
import { eliminarProductoAction } from "./actions";

export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<{ error?: string }> };

export default async function ProductosPage({ searchParams }: Props) {
  const { error } = await searchParams;
  const usuario = await exigirUsuario();
  const administrador = esAdmin(usuario);
  const productos = await listarProductos();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className={titulo}>Productos</h1>
        {administrador ? (
          <Link href="/productos/nuevo" className={botonPrimario}>
            Nuevo producto
          </Link>
        ) : null}
      </div>

      <MensajeError mensaje={error} />

      {productos.length === 0 ? (
        <p className={textoVacio}>Todavia no hay productos registrados.</p>
      ) : (
        <div className={contenedorTabla}>
          <table className={tabla}>
            <thead className={encabezadoTabla}>
              <tr>
                <th className={celda}>Nombre</th>
                <th className={celda}>Categoria</th>
                <th className={celda}>Precio</th>
                <th className={celda}>Stock</th>
                {administrador ? (
                  <th className={`${celda} text-right`}>Acciones</th>
                ) : null}
              </tr>
            </thead>
            <tbody>
              {productos.map((producto) => (
                <tr key={producto.id} className={fila}>
                  <td className={celda}>
                    <span className="font-medium">{producto.nombre}</span>
                    {producto.descripcion ? (
                      <p className="text-xs text-slate-500">{producto.descripcion}</p>
                    ) : null}
                  </td>
                  <td className={celda}>{producto.categoria ?? "-"}</td>
                  <td className={celda}>${producto.precio.toFixed(2)}</td>
                  <td className={celda}>{producto.stock}</td>
                  {administrador ? (
                    <td className={celda}>
                      <div className="flex items-center justify-end gap-3">
                        <Link
                          href={`/productos/${producto.id}/editar`}
                          className={enlaceAccion}
                        >
                          Editar
                        </Link>
                        <form action={eliminarProductoAction}>
                          <input type="hidden" name="id" value={producto.id} />
                          <button type="submit" className={botonPeligro}>
                            Eliminar
                          </button>
                        </form>
                      </div>
                    </td>
                  ) : null}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {administrador ? null : (
        <p className="mt-4 text-xs text-slate-500">
          Solo la administracion puede dar de alta, editar o eliminar productos.
        </p>
      )}
    </div>
  );
}
