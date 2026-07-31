import Link from "next/link";
import MensajeError from "@/components/MensajeError";
import {
  botonPrimario,
  campo,
  enlaceSecundario,
  etiqueta,
  textoVacio,
  titulo,
} from "@/components/ui";
import { listarProductos } from "@/lib/productos";
import { listarUsuarios } from "@/lib/usuarios";
import { crearCompraAction } from "../actions";

export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<{ error?: string }> };

export default async function NuevaCompraPage({ searchParams }: Props) {
  const { error } = await searchParams;
  const [usuarios, productos] = await Promise.all([listarUsuarios(), listarProductos()]);
  const disponibles = productos.filter((producto) => producto.stock > 0);

  return (
    <div>
      <h1 className={`mb-6 ${titulo}`}>Nueva compra</h1>

      <MensajeError mensaje={error} />

      {usuarios.length === 0 || disponibles.length === 0 ? (
        <p className={textoVacio}>
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
              required
              defaultValue={1}
              className={campo}
            />
          </div>

          <div className="flex items-center gap-3">
            <button type="submit" className={botonPrimario}>
              Registrar compra
            </button>
            <Link href="/compras" className={enlaceSecundario}>
              Cancelar
            </Link>
          </div>
        </form>
      )}
    </div>
  );
}
