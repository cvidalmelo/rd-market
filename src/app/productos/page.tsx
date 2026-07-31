import Link from "next/link";
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
import { listarProductos } from "@/lib/productos";
import { eliminarProductoAction } from "./actions";

export const dynamic = "force-dynamic";

export default async function ProductosPage() {
  const productos = await listarProductos();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className={titulo}>Productos</h1>
        <Link href="/productos/nuevo" className={botonPrimario}>
          Nuevo producto
        </Link>
      </div>

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
                <th className={`${celda} text-right`}>Acciones</th>
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
