/**
 * Roles de la aplicacion. Vive aparte de `lib/auth` porque tambien lo usan
 * componentes de cliente, que no deben arrastrar la instancia de Better Auth
 * ni el cliente de Prisma al paquete del navegador.
 */

export const ROL_ADMIN = "admin";
export const ROL_USUARIO = "user";

export type Rol = typeof ROL_ADMIN | typeof ROL_USUARIO;

/**
 * Un usuario es administrador si su campo `role` incluye el rol `admin`.
 * El plugin admin guarda varios roles separados por coma.
 */
export function esAdmin(usuario?: { role?: string | null } | null) {
  return (usuario?.role ?? "")
    .split(",")
    .map((rol) => rol.trim())
    .includes(ROL_ADMIN);
}

/** Normaliza cualquier entrada al conjunto de roles soportado. */
export function normalizarRol(valor: unknown): Rol {
  return String(valor ?? "").trim() === ROL_ADMIN ? ROL_ADMIN : ROL_USUARIO;
}
