import Link from "next/link";
import { botonPrimario, campo, enlaceSecundario, etiqueta } from "@/components/ui";
import type { Usuario } from "@/lib/usuarios";

type Props = {
  action: (formData: FormData) => void | Promise<void>;
  usuario?: Usuario;
  textoBoton: string;
};

export default function FormularioUsuario({ action, usuario, textoBoton }: Props) {
  return (
    <form action={action} className="max-w-lg space-y-4">
      {usuario ? <input type="hidden" name="id" value={usuario.id} /> : null}

      <div>
        <label className={etiqueta} htmlFor="nombre">
          Nombre
        </label>
        <input
          id="nombre"
          name="nombre"
          type="text"
          required
          defaultValue={usuario?.name ?? ""}
          className={campo}
        />
      </div>

      <div>
        <label className={etiqueta} htmlFor="email">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          defaultValue={usuario?.email ?? ""}
          className={campo}
        />
      </div>

      <div>
        <label className={etiqueta} htmlFor="password">
          Contrasena
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required={!usuario}
          minLength={4}
          className={campo}
        />
        {usuario ? (
          <p className="mt-1 text-xs text-slate-500">
            Better Auth guarda la contrasena cifrada, por eso no se puede mostrar. Dejalo
            vacio para conservar la actual.
          </p>
        ) : null}
      </div>

      <div>
        <label className={etiqueta} htmlFor="rol">
          Rol
        </label>
        <select id="rol" name="rol" defaultValue={usuario?.role ?? "user"} className={campo}>
          <option value="user">Cliente</option>
          <option value="admin">Administrador</option>
        </select>
      </div>

      <div className="flex items-center gap-3">
        <button type="submit" className={botonPrimario}>
          {textoBoton}
        </button>
        <Link href="/usuarios" className={enlaceSecundario}>
          Cancelar
        </Link>
      </div>
    </form>
  );
}
