import MensajeError from "@/components/MensajeError";
import { titulo } from "@/components/ui";
import FormularioProducto from "../FormularioProducto";
import { crearProductoAction } from "../actions";

type Props = { searchParams: Promise<{ error?: string }> };

export default async function NuevoProductoPage({ searchParams }: Props) {
  const { error } = await searchParams;

  return (
    <div>
      <h1 className={`mb-6 ${titulo}`}>Nuevo producto</h1>
      <MensajeError mensaje={error} />
      <FormularioProducto action={crearProductoAction} textoBoton="Crear producto" />
    </div>
  );
}
