import Link from "next/link";
import { redirect } from "next/navigation";
import MensajeError from "@/components/MensajeError";
import { botonPrimario, campo, enlaceSecundario, etiqueta, titulo } from "@/components/ui";
import { obtenerSesion } from "@/lib/dal";
import { registrarseAction } from "./actions";

type Props = { searchParams: Promise<{ error?: string }> };

export default async function RegistroPage({ searchParams }: Props) {
  const { error } = await searchParams;

  if (await obtenerSesion()) {
    redirect("/");
  }

  return (
    <div className="mx-auto max-w-sm">
      <h1 className={`mb-6 ${titulo}`}>Crear cuenta</h1>
      <MensajeError mensaje={error} />

      <form action={registrarseAction} className="space-y-4">
        <div>
          <label className={etiqueta} htmlFor="nombre">
            Nombre
          </label>
          <input id="nombre" name="nombre" type="text" required className={campo} />
        </div>

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
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={4}
            className={campo}
          />
        </div>

        <button type="submit" className={botonPrimario}>
          Crear cuenta
        </button>
      </form>

      <p className="mt-6 text-sm text-slate-600">
        Las cuentas nuevas se crean con el rol de cliente.{" "}
        <Link href="/login" className={enlaceSecundario}>
          Ya tengo cuenta
        </Link>
      </p>
    </div>
  );
}
