import { titulo } from "@/components/ui";
import FormularioUsuario from "../FormularioUsuario";
import { crearUsuarioAction } from "../actions";

export default function NuevoUsuarioPage() {
  return (
    <div>
      <h1 className={`mb-6 ${titulo}`}>Nuevo usuario</h1>
      <FormularioUsuario action={crearUsuarioAction} textoBoton="Crear usuario" />
    </div>
  );
}
