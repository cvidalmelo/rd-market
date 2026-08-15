import "server-only";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "./auth";
import { ErrorDeAutorizacion, ErrorDeValidacion } from "./errores";
import { esAdmin } from "./roles";

/**
 * Autorizacion de la API REST.
 *
 * El proxy no cubre `/api`, asi que cada route handler comprueba aqui su propia
 * sesion y su rol antes de tocar los datos.
 */

/** Exige una sesion valida. Devuelve 401 si no la hay. */
export async function exigirSesionApi() {
  const sesion = await auth.api.getSession({ headers: await headers() });

  if (!sesion) {
    throw new ErrorDeAutorizacion(401, "Necesitas iniciar sesion.");
  }

  return sesion;
}

/** Exige una sesion de administrador. Devuelve 403 si el rol no alcanza. */
export async function exigirAdminApi() {
  const sesion = await exigirSesionApi();

  if (!esAdmin(sesion.user)) {
    throw new ErrorDeAutorizacion(403, "Necesitas permisos de administrador.");
  }

  return sesion;
}

/**
 * Traduce los errores conocidos a una respuesta JSON. Cualquier otro error se
 * vuelve a lanzar para que Next lo trate como un fallo del servidor.
 */
export function responderError(error: unknown, estadoDeValidacion = 400) {
  if (error instanceof ErrorDeAutorizacion) {
    return NextResponse.json({ error: error.message }, { status: error.estado });
  }

  if (error instanceof ErrorDeValidacion) {
    return NextResponse.json({ error: error.message }, { status: estadoDeValidacion });
  }

  throw error;
}
