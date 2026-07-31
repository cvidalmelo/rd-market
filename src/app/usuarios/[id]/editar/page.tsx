import { notFound } from "next/navigation";
import { obtenerUsuario } from "@/lib/usuarios";
import FormularioUsuario from "../../FormularioUsuario";
import { actualizarUsuarioAction } from "../../actions";

type Props = { params: Promise<{ id: string }> };

export default async function EditarUsuarioPage({ params }: Props) {
  const { id } = await params;
  const usuario = await obtenerUsuario(id);

  if (!usuario) {
    notFound();
  }

  return (
    <div>
      <h1 className="mb-6 text-xl font-semibold">Editar usuario</h1>
      <FormularioUsuario
        action={actualizarUsuarioAction}
        usuario={usuario}
        textoBoton="Guardar cambios"
      />
    </div>
  );
}
