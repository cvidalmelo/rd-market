import prisma from "./prisma";

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

export function listarProductos() {
  return prisma.producto.findMany({ orderBy: { creadoEn: "desc" } });
}

export function obtenerProducto(id: string) {
  return prisma.producto.findUnique({ where: { id } });
}

export function crearProducto(datos: DatosProducto) {
  return prisma.producto.create({ data: datos });
}

export function actualizarProducto(id: string, datos: DatosProducto) {
  return prisma.producto.update({ where: { id }, data: datos });
}

export function eliminarProducto(id: string) {
  return prisma.producto.delete({ where: { id } });
}
