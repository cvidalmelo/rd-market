import Link from "next/link";
import { listarUsuarios } from "@/lib/usuarios";
import { eliminarUsuarioAction } from "./actions";

export const dynamic = "force-dynamic";

export default async function UsuariosPage() {
  const usuarios = await listarUsuarios();
  const formatoFecha = new Intl.DateTimeFormat("es", { dateStyle: "medium" });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Usuarios</h1>
        <Link
          href="/usuarios/nuevo"
          className="rounded bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
        >
          Nuevo usuario
        </Link>
      </div>

      {usuarios.length === 0 ? (
        <p className="text-sm text-slate-600">Todavia no hay usuarios registrados.</p>
      ) : (
        <div className="overflow-x-auto rounded border border-slate-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-100 text-xs uppercase text-slate-600">
              <tr>
                <th className="px-4 py-3">Nombre</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Registrado</th>
                <th className="px-4 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((usuario) => (
                <tr key={usuario.id} className="border-b border-slate-100 last:border-0">
                  <td className="px-4 py-3 font-medium">{usuario.nombre}</td>
                  <td className="px-4 py-3">{usuario.email}</td>
                  <td className="px-4 py-3">{formatoFecha.format(usuario.creadoEn)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-3">
                      <Link
                        href={`/usuarios/${usuario.id}/editar`}
                        className="text-slate-700 hover:underline"
                      >
                        Editar
                      </Link>
                      <form action={eliminarUsuarioAction}>
                        <input type="hidden" name="id" value={usuario.id} />
                        <button type="submit" className="text-red-600 hover:underline">
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
