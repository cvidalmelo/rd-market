import prisma from "./prisma";
import { ErrorDeValidacion } from "./errores";

export type DatosProducto = {
  nombre: string;
  descripcion: string | null;
  precio: number;
  stock: number;
  categoria: string | null;
};

export type Producto = Awaited<ReturnType<typeof listarProductos>>[number];

function texto(valor: unknown) {
  return valor === undefined || valor === null ? "" : String(valor).trim();
}

/** Convierte los datos de un formulario o de una peticion JSON al formato del modelo. */
export function normalizarProducto(entrada: Record<string, unknown>): DatosProducto {
  return {
    nombre: texto(entrada.nombre),
    descripcion: texto(entrada.descripcion) || null,
    precio: Number(entrada.precio),
    stock: Number(entrada.stock),
    categoria: texto(entrada.categoria) || null,
  };
}

/** Reglas de negocio comunes a la creacion y a la edicion de un producto. */
export function validarProducto(datos: DatosProducto) {
  if (!datos.nombre) {
    throw new ErrorDeValidacion("El nombre del producto es obligatorio.");
  }

  if (!Number.isFinite(datos.precio) || datos.precio < 0) {
    throw new ErrorDeValidacion("El precio debe ser un numero mayor o igual a cero.");
  }

  if (!Number.isInteger(datos.stock) || datos.stock < 0) {
    throw new ErrorDeValidacion("El stock debe ser un numero entero mayor o igual a cero.");
  }
}

export function listarProductos() {
  return prisma.producto.findMany({ orderBy: { creadoEn: "desc" } });
}

export function contarProductos() {
  return prisma.producto.count();
}

export function obtenerProducto(id: string) {
  return prisma.producto.findUnique({ where: { id } });
}

export function crearProducto(datos: DatosProducto) {
  validarProducto(datos);
  return prisma.producto.create({ data: datos });
}

export function actualizarProducto(id: string, datos: DatosProducto) {
  validarProducto(datos);
  return prisma.producto.update({ where: { id }, data: datos });
}

export function eliminarProducto(id: string) {
  return prisma.producto.delete({ where: { id } });
}
