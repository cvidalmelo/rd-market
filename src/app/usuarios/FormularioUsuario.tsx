import Link from "next/link";
import type { Usuario } from "@/lib/usuarios";

type Props = {
  action: (formData: FormData) => void | Promise<void>;
  usuario?: Usuario;
  textoBoton: string;
};

const campo =
  "mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none";
const etiqueta = "block text-sm font-medium text-slate-700";

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
          defaultValue={usuario?.nombre ?? ""}
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
          type="text"
          defaultValue={usuario?.password ?? ""}
          className={campo}
        />
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          className="rounded bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
        >
          {textoBoton}
        </button>
        <Link href="/usuarios" className="text-sm text-slate-600 hover:underline">
          Cancelar
        </Link>
      </div>
    </form>
  );
}
