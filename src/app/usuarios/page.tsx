import Link from "next/link";
import MensajeError from "@/components/MensajeError";
import {
  botonPeligro,
  botonPrimario,
  celda,
  contenedorTabla,
  encabezadoTabla,
  enlaceAccion,
  fila,
  tabla,
  textoVacio,
  titulo,
} from "@/components/ui";
import { exigirAdmin } from "@/lib/dal";
import { esAdmin } from "@/lib/roles";
import { listarUsuarios } from "@/lib/usuarios";
import {
  banearUsuarioAction,
  desbanearUsuarioAction,
  eliminarUsuarioAction,
} from "./actions";

export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<{ error?: string }> };

export default async function UsuariosPage({ searchParams }: Props) {
  const { error } = await searchParams;
  const administrador = await exigirAdmin();
  const usuarios = await listarUsuarios();
  const formatoFecha = new Intl.DateTimeFormat("es", { dateStyle: "medium" });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className={titulo}>Usuarios</h1>
        <Link href="/usuarios/nuevo" className={botonPrimario}>
          Nuevo usuario
        </Link>
      </div>

      <MensajeError mensaje={error} />

      {usuarios.length === 0 ? (
        <p className={textoVacio}>Todavia no hay usuarios registrados.</p>
      ) : (
        <div className={contenedorTabla}>
          <table className={tabla}>
            <thead className={encabezadoTabla}>
              <tr>
                <th className={celda}>Nombre</th>
                <th className={celda}>Email</th>
                <th className={celda}>Rol</th>
                <th className={celda}>Estado</th>
                <th className={celda}>Registrado</th>
                <th className={`${celda} text-right`}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((usuario) => {
                const esUnoMismo = usuario.id === administrador.id;

                return (
                  <tr key={usuario.id} className={fila}>
                    <td className={`${celda} font-medium`}>{usuario.name}</td>
                    <td className={celda}>{usuario.email}</td>
                    <td className={celda}>
                      {esAdmin(usuario) ? "Administrador" : "Cliente"}
                    </td>
                    <td className={celda}>{usuario.banned ? "Bloqueado" : "Activo"}</td>
                    <td className={celda}>{formatoFecha.format(usuario.createdAt)}</td>
                    <td className={celda}>
                      <div className="flex items-center justify-end gap-3">
                        <Link
                          href={`/usuarios/${usuario.id}/editar`}
                          className={enlaceAccion}
                        >
                          Editar
                        </Link>

                        {esUnoMismo ? null : (
                          <form
                            action={
                              usuario.banned ? desbanearUsuarioAction : banearUsuarioAction
                            }
                          >
                            <input type="hidden" name="id" value={usuario.id} />
                            <button type="submit" className={enlaceAccion}>
                              {usuario.banned ? "Desbloquear" : "Bloquear"}
                            </button>
                          </form>
                        )}

                        {esUnoMismo ? null : (
                          <form action={eliminarUsuarioAction}>
                            <input type="hidden" name="id" value={usuario.id} />
                            <button type="submit" className={botonPeligro}>
                              Eliminar
                            </button>
                          </form>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <p className="mt-4 text-xs text-slate-500">
        Bloquear a un usuario cierra sus sesiones abiertas y le impide volver a entrar.
      </p>
    </div>
  );
}
