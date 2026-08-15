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
import { exigirUsuario } from "@/lib/dal";
import { listarProductos } from "@/lib/productos";
import { esAdmin } from "@/lib/roles";
import { listarUsuarios } from "@/lib/usuarios";
import { crearCompraAction } from "../actions";

export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<{ error?: string }> };

export default async function NuevaCompraPage({ searchParams }: Props) {
  const { error } = await searchParams;
  const usuario = await exigirUsuario();
  const administrador = esAdmin(usuario);

  // Un cliente solo puede comprar a su nombre, asi que no se le ofrece la lista.
  const [usuarios, productos] = await Promise.all([
    administrador ? listarUsuarios() : Promise.resolve([]),
    listarProductos(),
  ]);
  const disponibles = productos.filter((producto) => producto.stock > 0);

  return (
    <div>
      <h1 className={`mb-6 ${titulo}`}>Nueva compra</h1>

      <MensajeError mensaje={error} />

      {disponibles.length === 0 ? (
        <p className={textoVacio}>
          Para registrar una compra necesitas al menos un producto con stock disponible.
        </p>
      ) : (
        <form action={crearCompraAction} className="max-w-lg space-y-4">
          <div>
            <label className={etiqueta} htmlFor="usuarioId">
              Usuario
            </label>
            {administrador ? (
              <select id="usuarioId" name="usuarioId" className={campo}>
                {usuarios.map((cliente) => (
                  <option key={cliente.id} value={cliente.id}>
                    {cliente.name} ({cliente.email})
                  </option>
                ))}
              </select>
            ) : (
              <input
                id="usuarioId"
                name="usuarioId"
                type="text"
                readOnly
                value={`${usuario.name} (${usuario.email})`}
                className={`${campo} bg-slate-100 text-slate-500`}
              />
            )}
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
