import prisma from "./prisma";
import { ErrorDeValidacion } from "./errores";

const FORMATO_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type DatosUsuario = {
  nombre: string;
  email: string;
  password: string;
};

export type Usuario = Awaited<ReturnType<typeof listarUsuarios>>[number];

function texto(valor: unknown) {
  return valor === undefined || valor === null ? "" : String(valor).trim();
}

/** Convierte los datos de un formulario o de una peticion JSON al formato del modelo. */
export function normalizarUsuario(entrada: Record<string, unknown>): DatosUsuario {
  return {
    nombre: texto(entrada.nombre),
    email: texto(entrada.email).toLowerCase(),
    password: texto(entrada.password),
  };
}

/**
 * Reglas de negocio comunes a la creacion y a la edicion de un usuario.
 * `idActual` evita que un usuario choque consigo mismo al editarse.
 */
export async function validarUsuario(datos: DatosUsuario, idActual?: string) {
  if (!datos.nombre) {
    throw new ErrorDeValidacion("El nombre del usuario es obligatorio.");
  }

  if (!FORMATO_EMAIL.test(datos.email)) {
    throw new ErrorDeValidacion("El email no tiene un formato valido.");
  }

  if (datos.password.length < 4) {
    throw new ErrorDeValidacion("La contrasena debe tener al menos 4 caracteres.");
  }

  const existente = await prisma.usuario.findUnique({ where: { email: datos.email } });

  if (existente && existente.id !== idActual) {
    throw new ErrorDeValidacion("Ya existe un usuario registrado con ese email.");
  }
}

export function listarUsuarios() {
  return prisma.usuario.findMany({ orderBy: { creadoEn: "desc" } });
}

export function contarUsuarios() {
  return prisma.usuario.count();
}

export function obtenerUsuario(id: string) {
  return prisma.usuario.findUnique({ where: { id } });
}

export async function crearUsuario(datos: DatosUsuario) {
  await validarUsuario(datos);
  return prisma.usuario.create({ data: datos });
}

export async function actualizarUsuario(id: string, datos: DatosUsuario) {
  await validarUsuario(datos, id);
  return prisma.usuario.update({ where: { id }, data: datos });
}

export function eliminarUsuario(id: string) {
  return prisma.usuario.delete({ where: { id } });
}
