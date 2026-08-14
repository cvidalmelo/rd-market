import "server-only";
import { cache } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "./auth";
import { esAdmin } from "./roles";

/**
 * Capa de acceso a datos de la sesion. El proxy solo hace una comprobacion
 * optimista sobre la cookie; la verificacion real vive aqui, contra la tabla
 * `session`. `cache` evita repetir el trabajo dentro de un mismo render.
 */
export const obtenerSesion = cache(async () =>
  auth.api.getSession({ headers: await headers() }),
);

/** Devuelve el usuario de la sesion, o `null` si no hay sesion valida. */
export const obtenerUsuarioActual = cache(async () => {
  const sesion = await obtenerSesion();

  return sesion?.user ?? null;
});

/** Igual que `obtenerUsuarioActual`, pero exige sesion: si no la hay, manda al login. */
export async function exigirUsuario() {
  const usuario = await obtenerUsuarioActual();

  if (!usuario) {
    redirect("/login");
  }

  return usuario;
}

/**
 * Exige que la sesion sea de un administrador. Un usuario normal vuelve al
 * inicio con el aviso de que la seccion no le corresponde.
 */
export async function exigirAdmin() {
  const usuario = await exigirUsuario();

  if (!esAdmin(usuario)) {
    redirect(
      `/?error=${encodeURIComponent("Necesitas permisos de administrador para entrar ahi.")}`,
    );
  }

  return usuario;
}

/** `true` si la sesion actual es de un administrador. */
export async function sesionEsAdmin() {
  return esAdmin(await obtenerUsuarioActual());
}
