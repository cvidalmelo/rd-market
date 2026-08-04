import "server-only";
import { cookies } from "next/headers";
import prisma from "./prisma";
import { ErrorDeValidacion } from "./errores";
import { COOKIE_SESION, DURACION_SESION_MS, cifrarSesion } from "./sesion-token";

export async function crearSesion(usuarioId: string) {
  const expira = new Date(Date.now() + DURACION_SESION_MS);
  const token = await cifrarSesion({ usuarioId });
  const almacen = await cookies();

  almacen.set(COOKIE_SESION, token, {
    httpOnly: true,
    // En desarrollo y en las pruebas de Selenium se navega por http://localhost,
    // donde una cookie `secure` nunca se enviaria.
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: expira,
    path: "/",
  });
}

export async function cerrarSesion() {
  const almacen = await cookies();
  almacen.delete(COOKIE_SESION);
}

/**
 * Comprueba las credenciales contra la tabla de usuarios.
 * Se usa el mismo mensaje para email inexistente y para contrasena incorrecta,
 * para no revelar que correos estan registrados.
 */
export async function autenticar(email: string, password: string) {
  const correo = email.trim().toLowerCase();
  const usuario = correo ? await prisma.usuario.findUnique({ where: { email: correo } }) : null;

  if (!usuario || usuario.password !== password) {
    throw new ErrorDeValidacion("Credenciales invalidas.");
  }

  return usuario;
}
