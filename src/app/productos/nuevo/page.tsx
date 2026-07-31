import FormularioProducto from "../FormularioProducto";
import { crearProductoAction } from "../actions";

export default function NuevoProductoPage() {
  return (
    <div>
      <h1 className="mb-6 text-xl font-semibold">Nuevo producto</h1>
      <FormularioProducto action={crearProductoAction} textoBoton="Crear producto" />
    </div>
  );
}
