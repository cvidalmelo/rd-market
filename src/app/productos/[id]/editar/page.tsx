import { notFound } from "next/navigation";
import { titulo } from "@/components/ui";
import { obtenerProducto } from "@/lib/productos";
import FormularioProducto from "../../FormularioProducto";
import { actualizarProductoAction } from "../../actions";

type Props = { params: Promise<{ id: string }> };

export default async function EditarProductoPage({ params }: Props) {
  const { id } = await params;
  const producto = await obtenerProducto(id);

  if (!producto) {
    notFound();
  }

  return (
    <div>
      <h1 className={`mb-6 ${titulo}`}>Editar producto</h1>
      <FormularioProducto
        action={actualizarProductoAction}
        producto={producto}
        textoBoton="Guardar cambios"
      />
    </div>
  );
}
