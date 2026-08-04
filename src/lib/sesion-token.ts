import { SignJWT, jwtVerify } from "jose";

/**
 * Firma y verificacion del token de sesion. Vive aparte de `sesion.ts` para que
 * el proxy pueda validar la cookie sin arrastrar Prisma a su bundle.
 */

export const COOKIE_SESION = "sesion";

export const DURACION_SESION_MS = 7 * 24 * 60 * 60 * 1000;

/**
 * Igual que en `prisma.ts`, se deja un valor por defecto para que un clon nuevo
 * arranque sin `.env`. En produccion la clave debe venir del entorno.
 */
const claveSecreta = (process.env.SESSION_SECRET ?? "").trim() || "minimarket-secreto-academico";
const claveCodificada = new TextEncoder().encode(claveSecreta);

/** Solo el identificador del usuario: nunca email ni contrasena. */
export type DatosSesion = { usuarioId: string };

export function cifrarSesion(datos: DatosSesion) {
  return new SignJWT(datos)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(claveCodificada);
}

/** Devuelve los datos de la sesion o `null` si el token falta, expiro o fue alterado. */
export async function descifrarSesion(token?: string): Promise<DatosSesion | null> {
  if (!token) {
    return null;
  }

  try {
    const { payload } = await jwtVerify(token, claveCodificada, { algorithms: ["HS256"] });
    const usuarioId = payload.usuarioId;

    return typeof usuarioId === "string" ? { usuarioId } : null;
  } catch {
    return null;
  }
}
