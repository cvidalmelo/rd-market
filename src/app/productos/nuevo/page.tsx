import { titulo } from "@/components/ui";
import FormularioProducto from "../FormularioProducto";
import { crearProductoAction } from "../actions";

export default function NuevoProductoPage() {
  return (
    <div>
      <h1 className={`mb-6 ${titulo}`}>Nuevo producto</h1>
      <FormularioProducto action={crearProductoAction} textoBoton="Crear producto" />
    </div>
  );
}
