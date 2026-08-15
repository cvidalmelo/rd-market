import MensajeError from "@/components/MensajeError";
import { titulo } from "@/components/ui";
import { exigirAdmin } from "@/lib/dal";
import FormularioUsuario from "../FormularioUsuario";
import { crearUsuarioAction } from "../actions";

type Props = { searchParams: Promise<{ error?: string }> };

export default async function NuevoUsuarioPage({ searchParams }: Props) {
  const { error } = await searchParams;
  await exigirAdmin();

  return (
    <div>
      <h1 className={`mb-6 ${titulo}`}>Nuevo usuario</h1>
      <MensajeError mensaje={error} />
      <FormularioUsuario action={crearUsuarioAction} textoBoton="Crear usuario" />
    </div>
  );
}
