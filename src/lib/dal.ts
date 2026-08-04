import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import prisma from "./prisma";
import { COOKIE_SESION, descifrarSesion } from "./sesion-token";

/**
 * Capa de acceso a datos de la sesion. El proxy solo hace una comprobacion
 * optimista sobre la cookie; la verificacion real vive aqui, junto a los datos.
 * `cache` evita repetir el trabajo dentro de un mismo render.
 */
export const obtenerSesion = cache(async () => {
  const almacen = await cookies();
  return descifrarSesion(almacen.get(COOKIE_SESION)?.value);
});

/** Devuelve el usuario de la sesion, o `null` si no hay sesion valida. */
export const obtenerUsuarioActual = cache(async () => {
  const sesion = await obtenerSesion();

  if (!sesion) {
    return null;
  }

  return prisma.usuario.findUnique({ where: { id: sesion.usuarioId } });
});

/** Igual que `obtenerUsuarioActual`, pero exige sesion: si no la hay, manda al login. */
export async function exigirUsuario() {
  const usuario = await obtenerUsuarioActual();

  if (!usuario) {
    redirect("/login");
  }

  return usuario;
}
