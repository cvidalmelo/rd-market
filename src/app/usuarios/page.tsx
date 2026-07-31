import Link from "next/link";
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
import { listarUsuarios } from "@/lib/usuarios";
import { eliminarUsuarioAction } from "./actions";

export const dynamic = "force-dynamic";

export default async function UsuariosPage() {
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

      {usuarios.length === 0 ? (
        <p className={textoVacio}>Todavia no hay usuarios registrados.</p>
      ) : (
        <div className={contenedorTabla}>
          <table className={tabla}>
            <thead className={encabezadoTabla}>
              <tr>
                <th className={celda}>Nombre</th>
                <th className={celda}>Email</th>
                <th className={celda}>Registrado</th>
                <th className={`${celda} text-right`}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((usuario) => (
                <tr key={usuario.id} className={fila}>
                  <td className={`${celda} font-medium`}>{usuario.nombre}</td>
                  <td className={celda}>{usuario.email}</td>
                  <td className={celda}>{formatoFecha.format(usuario.creadoEn)}</td>
                  <td className={celda}>
                    <div className="flex items-center justify-end gap-3">
                      <Link
                        href={`/usuarios/${usuario.id}/editar`}
                        className={enlaceAccion}
                      >
                        Editar
                      </Link>
                      <form action={eliminarUsuarioAction}>
                        <input type="hidden" name="id" value={usuario.id} />
                        <button type="submit" className={botonPeligro}>
                          Eliminar
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
