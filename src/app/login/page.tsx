import Link from "next/link";
import { redirect } from "next/navigation";
import MensajeError from "@/components/MensajeError";
import { botonPrimario, campo, enlaceSecundario, etiqueta, titulo } from "@/components/ui";
import { obtenerSesion } from "@/lib/dal";
import { iniciarSesionAction } from "./actions";

type Props = { searchParams: Promise<{ error?: string }> };

export default async function LoginPage({ searchParams }: Props) {
  const { error } = await searchParams;

  if (await obtenerSesion()) {
    redirect("/");
  }

  return (
    <div className="mx-auto max-w-sm">
      <h1 className={`mb-6 ${titulo}`}>Iniciar sesion</h1>
      <MensajeError mensaje={error} />

      <form action={iniciarSesionAction} className="space-y-4">
        <div>
          <label className={etiqueta} htmlFor="email">
            Email
          </label>
          <input id="email" name="email" type="email" required className={campo} />
        </div>

        <div>
          <label className={etiqueta} htmlFor="password">
            Contrasena
          </label>
          <input id="password" name="password" type="password" required className={campo} />
        </div>

        <button type="submit" className={botonPrimario}>
          Iniciar sesion
        </button>
      </form>

      <p className="mt-6 text-sm text-slate-600">
        Todavia no tienes cuenta?{" "}
        <Link href="/registro" className={enlaceSecundario}>
          Crear cuenta
        </Link>
      </p>

      <p className="mt-2 text-xs text-slate-500">
        Usuarios de ejemplo: ana@minimarket.com / ana1234 (administradora) y
        carlos@minimarket.com / carlos1234 (cliente)
      </p>
    </div>
  );
}
