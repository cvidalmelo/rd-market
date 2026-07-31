import { notFound } from "next/navigation";
import MensajeError from "@/components/MensajeError";
import { titulo } from "@/components/ui";
import { obtenerProducto } from "@/lib/productos";
import FormularioProducto from "../../FormularioProducto";
import { actualizarProductoAction } from "../../actions";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
};

export default async function EditarProductoPage({ params, searchParams }: Props) {
  const { id } = await params;
  const { error } = await searchParams;
  const producto = await obtenerProducto(id);

  if (!producto) {
    notFound();
  }

  return (
    <div>
      <h1 className={`mb-6 ${titulo}`}>Editar producto</h1>
      <MensajeError mensaje={error} />
      <FormularioProducto
        action={actualizarProductoAction}
        producto={producto}
        textoBoton="Guardar cambios"
      />
    </div>
  );
}
