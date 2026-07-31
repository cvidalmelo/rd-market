import prisma from "./prisma";

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

export function listarUsuarios() {
  return prisma.usuario.findMany({ orderBy: { creadoEn: "desc" } });
}

export function obtenerUsuario(id: string) {
  return prisma.usuario.findUnique({ where: { id } });
}

export function crearUsuario(datos: DatosUsuario) {
  return prisma.usuario.create({ data: datos });
}

export function actualizarUsuario(id: string, datos: DatosUsuario) {
  return prisma.usuario.update({ where: { id }, data: datos });
}

export function eliminarUsuario(id: string) {
  return prisma.usuario.delete({ where: { id } });
}
