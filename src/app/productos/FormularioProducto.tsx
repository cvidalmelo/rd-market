import Link from "next/link";
import { botonPrimario, campo, enlaceSecundario, etiqueta } from "@/components/ui";
import type { Producto } from "@/lib/productos";

type Props = {
  action: (formData: FormData) => void | Promise<void>;
  producto?: Producto;
  textoBoton: string;
};

export default function FormularioProducto({ action, producto, textoBoton }: Props) {
  return (
    <form action={action} className="max-w-lg space-y-4">
      {producto ? <input type="hidden" name="id" value={producto.id} /> : null}

      <div>
        <label className={etiqueta} htmlFor="nombre">
          Nombre
        </label>
        <input
          id="nombre"
          name="nombre"
          type="text"
          defaultValue={producto?.nombre ?? ""}
          className={campo}
        />
      </div>

      <div>
        <label className={etiqueta} htmlFor="descripcion">
          Descripcion
        </label>
        <textarea
          id="descripcion"
          name="descripcion"
          rows={3}
          defaultValue={producto?.descripcion ?? ""}
          className={campo}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={etiqueta} htmlFor="precio">
            Precio
          </label>
          <input
            id="precio"
            name="precio"
            type="number"
            step="0.01"
            min="0"
            defaultValue={producto?.precio ?? ""}
            className={campo}
          />
        </div>

        <div>
          <label className={etiqueta} htmlFor="stock">
            Stock
          </label>
          <input
            id="stock"
            name="stock"
            type="number"
            min="0"
            defaultValue={producto?.stock ?? ""}
            className={campo}
          />
        </div>
      </div>

      <div>
        <label className={etiqueta} htmlFor="categoria">
          Categoria
        </label>
        <input
          id="categoria"
          name="categoria"
          type="text"
          defaultValue={producto?.categoria ?? ""}
          className={campo}
        />
      </div>

      <div className="flex items-center gap-3">
        <button type="submit" className={botonPrimario}>
          {textoBoton}
        </button>
        <Link href="/productos" className={enlaceSecundario}>
          Cancelar
        </Link>
      </div>
    </form>
  );
}
