import { notFound } from "next/navigation";
import MensajeError from "@/components/MensajeError";
import { titulo } from "@/components/ui";
import { exigirAdmin } from "@/lib/dal";
import { obtenerUsuario } from "@/lib/usuarios";
import FormularioUsuario from "../../FormularioUsuario";
import { actualizarUsuarioAction } from "../../actions";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
};

export default async function EditarUsuarioPage({ params, searchParams }: Props) {
  const { id } = await params;
  const { error } = await searchParams;
  await exigirAdmin();
  const usuario = await obtenerUsuario(id);

  if (!usuario) {
    notFound();
  }

  return (
    <div>
      <h1 className={`mb-6 ${titulo}`}>Editar usuario</h1>
      <MensajeError mensaje={error} />
      <FormularioUsuario
        action={actualizarUsuarioAction}
        usuario={usuario}
        textoBoton="Guardar cambios"
      />
    </div>
  );
}
