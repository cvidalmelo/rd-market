import "server-only";
import { headers } from "next/headers";
import { APIError } from "better-auth/api";
import { auth } from "./auth";
import { ErrorDeValidacion } from "./errores";

/**
 * Envoltorios sobre la API de Better Auth.
 *
 * Better Auth lanza `APIError` cuando la operacion falla; aqui se traduce a
 * `ErrorDeValidacion` para que los formularios sigan usando el mismo camino de
 * error que el resto de la aplicacion (`conManejoDeError` en `lib/formularios`).
 */

/** Inicia sesion con email y contrasena. La cookie la escribe el plugin `nextCookies`. */
export async function iniciarSesion(email: string, password: string) {
  const cabeceras = await headers();

  try {
    return await auth.api.signInEmail({
      body: { email: email.trim().toLowerCase(), password },
      headers: cabeceras,
    });
  } catch (error) {
    if (error instanceof APIError) {
      // No se distingue entre correo inexistente y contrasena incorrecta: el
      // mensaje es el mismo para no revelar que cuentas existen.
      throw new ErrorDeValidacion("Credenciales invalidas.");
    }

    throw error;
  }
}

/** Alta de una cuenta nueva desde el registro publico. El rol por defecto es `user`. */
export async function registrarUsuario(nombre: string, email: string, password: string) {
  const cabeceras = await headers();

  try {
    return await auth.api.signUpEmail({
      body: { name: nombre.trim(), email: email.trim().toLowerCase(), password },
      headers: cabeceras,
    });
  } catch (error) {
    if (error instanceof APIError) {
      throw new ErrorDeValidacion(mensajeDeAlta(error));
    }

    throw error;
  }
}

/** Cierra la sesion actual y borra la cookie. */
export async function cerrarSesion() {
  await auth.api.signOut({ headers: await headers() });
}

/** Traduce los errores de alta de Better Auth a los mensajes de la aplicacion. */
export function mensajeDeAlta(error: APIError) {
  const codigo = String(error.body?.code ?? "");

  if (codigo.includes("EMAIL_ALREADY") || codigo.includes("USER_ALREADY")) {
    return "Ya existe un usuario registrado con ese email.";
  }

  if (codigo.includes("PASSWORD_TOO_SHORT")) {
    return "La contrasena debe tener al menos 4 caracteres.";
  }

  if (codigo.includes("PASSWORD_TOO_LONG")) {
    return "La contrasena es demasiado larga.";
  }

  if (codigo.includes("EMAIL")) {
    return "El email no tiene un formato valido.";
  }

  return error.body?.message ?? "No se pudo completar la operacion.";
}
