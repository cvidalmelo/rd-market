import "server-only";
import { headers } from "next/headers";
import { APIError } from "better-auth/api";
import { auth } from "./auth";
import { ErrorDeValidacion } from "./errores";
import prisma from "./prisma";
import { type Rol, normalizarRol } from "./roles";
import { mensajeDeAlta } from "./sesion";

const FORMATO_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type DatosUsuario = {
  nombre: string;
  email: string;
  password: string;
  rol: Rol;
};

export type Usuario = Awaited<ReturnType<typeof listarUsuarios>>[number];

function texto(valor: unknown) {
  return valor === undefined || valor === null ? "" : String(valor).trim();
}

/** Convierte los datos de un formulario o de una peticion JSON al formato del modelo. */
export function normalizarUsuario(entrada: Record<string, unknown>): DatosUsuario {
  return {
    nombre: texto(entrada.nombre) || texto(entrada.name),
    email: texto(entrada.email).toLowerCase(),
    password: texto(entrada.password),
    rol: normalizarRol(texto(entrada.rol) || texto(entrada.role)),
  };
}

/**
 * Reglas comunes a cualquier alta de cuenta (registro publico o creacion desde
 * la administracion). La unicidad del email la comprueba Better Auth.
 */
export function validarDatosDeCuenta(datos: {
  nombre: string;
  email: string;
  password: string;
}) {
  if (!datos.nombre) {
    throw new ErrorDeValidacion("El nombre del usuario es obligatorio.");
  }

  if (!FORMATO_EMAIL.test(datos.email)) {
    throw new ErrorDeValidacion("El email no tiene un formato valido.");
  }

  if (datos.password.length < 4) {
    throw new ErrorDeValidacion("La contrasena debe tener al menos 4 caracteres.");
  }
}

/** Igual que la anterior, pero la contrasena es opcional al editar. */
export function validarEdicionDeCuenta(datos: DatosUsuario) {
  if (!datos.nombre) {
    throw new ErrorDeValidacion("El nombre del usuario es obligatorio.");
  }

  if (!FORMATO_EMAIL.test(datos.email)) {
    throw new ErrorDeValidacion("El email no tiene un formato valido.");
  }

  if (datos.password && datos.password.length < 4) {
    throw new ErrorDeValidacion("La contrasena debe tener al menos 4 caracteres.");
  }
}

/** Traduce los errores del plugin admin a mensajes propios de la aplicacion. */
async function conErroresDeAdmin<T>(operacion: () => Promise<T>) {
  try {
    return await operacion();
  } catch (error) {
    if (error instanceof APIError) {
      throw new ErrorDeValidacion(mensajeDeAlta(error));
    }

    throw error;
  }
}

export function listarUsuarios() {
  return prisma.user.findMany({ orderBy: { createdAt: "desc" } });
}

export function contarUsuarios() {
  return prisma.user.count();
}

export function obtenerUsuario(id: string) {
  return prisma.user.findUnique({ where: { id } });
}

/** Alta desde la administracion: Better Auth hashea la contrasena y crea la cuenta. */
export async function crearUsuario(datos: DatosUsuario) {
  validarDatosDeCuenta(datos);

  const cabeceras = await headers();

  return conErroresDeAdmin(() =>
    auth.api.createUser({
      body: {
        name: datos.nombre,
        email: datos.email,
        password: datos.password,
        role: datos.rol,
      },
      headers: cabeceras,
    }),
  );
}

/** Edicion desde la administracion. La contrasena solo se cambia si viene rellena. */
export async function actualizarUsuario(id: string, datos: DatosUsuario) {
  validarEdicionDeCuenta(datos);

  const cabeceras = await headers();

  await conErroresDeAdmin(async () => {
    await auth.api.adminUpdateUser({
      body: { userId: id, data: { name: datos.nombre, email: datos.email } },
      headers: cabeceras,
    });

    await auth.api.setRole({
      body: { userId: id, role: datos.rol },
      headers: cabeceras,
    });

    if (datos.password) {
      await auth.api.setUserPassword({
        body: { userId: id, newPassword: datos.password },
        headers: cabeceras,
      });
    }
  });

  return obtenerUsuario(id);
}

export async function cambiarRol(id: string, rol: unknown) {
  const cabeceras = await headers();

  return conErroresDeAdmin(() =>
    auth.api.setRole({
      body: { userId: id, role: normalizarRol(rol) },
      headers: cabeceras,
    }),
  );
}

/** Bloquea la cuenta y revoca sus sesiones abiertas. */
export async function banearUsuario(id: string, motivo?: string) {
  const cabeceras = await headers();

  return conErroresDeAdmin(() =>
    auth.api.banUser({
      body: { userId: id, banReason: motivo || "Bloqueado por la administracion" },
      headers: cabeceras,
    }),
  );
}

export async function desbanearUsuario(id: string) {
  const cabeceras = await headers();

  return conErroresDeAdmin(() =>
    auth.api.unbanUser({ body: { userId: id }, headers: cabeceras }),
  );
}

export async function eliminarUsuario(id: string) {
  const cabeceras = await headers();

  return conErroresDeAdmin(() =>
    auth.api.removeUser({ body: { userId: id }, headers: cabeceras }),
  );
}
