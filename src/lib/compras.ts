import prisma from "./prisma";
import { ErrorDeValidacion } from "./errores";

export type DatosCompra = {
  usuarioId: string;
  productoId: string;
  cantidad: number;
};

export type Compra = Awaited<ReturnType<typeof listarCompras>>[number];

function texto(valor: unknown) {
  return valor === undefined || valor === null ? "" : String(valor).trim();
}

/** Convierte los datos de un formulario o de una peticion JSON al formato del modelo. */
export function normalizarCompra(entrada: Record<string, unknown>): DatosCompra {
  return {
    usuarioId: texto(entrada.usuarioId),
    productoId: texto(entrada.productoId),
    cantidad: Number(entrada.cantidad),
  };
}

export function listarCompras() {
  return prisma.compra.findMany({
    orderBy: { fecha: "desc" },
    include: { usuario: true, producto: true },
  });
}

export function contarCompras() {
  return prisma.compra.count();
}

/**
 * Registra la compra y descuenta el stock del producto en una sola transaccion,
 * para que nunca quede una compra sin su descuento correspondiente.
 */
export async function crearCompra(datos: DatosCompra) {
  if (!datos.usuarioId || !datos.productoId) {
    throw new ErrorDeValidacion("Debes seleccionar un usuario y un producto.");
  }

  if (!Number.isInteger(datos.cantidad) || datos.cantidad < 1) {
    throw new ErrorDeValidacion("La cantidad debe ser un numero entero mayor que cero.");
  }

  return prisma.$transaction(async (tx) => {
    const producto = await tx.producto.findUnique({ where: { id: datos.productoId } });

    if (!producto) {
      throw new ErrorDeValidacion("El producto seleccionado no existe.");
    }

    if (producto.stock < datos.cantidad) {
      throw new ErrorDeValidacion(
        `Stock insuficiente: quedan ${producto.stock} unidades de ${producto.nombre}.`,
      );
    }

    await tx.producto.update({
      where: { id: datos.productoId },
      data: { stock: { decrement: datos.cantidad } },
    });

    return tx.compra.create({ data: datos });
  });
}

/** Elimina la compra y devuelve las unidades al stock del producto. */
export async function eliminarCompra(id: string) {
  return prisma.$transaction(async (tx) => {
    const compra = await tx.compra.findUnique({ where: { id } });

    if (!compra) {
      throw new ErrorDeValidacion("La compra no existe.");
    }

    await tx.producto.update({
      where: { id: compra.productoId },
      data: { stock: { increment: compra.cantidad } },
    });

    return tx.compra.delete({ where: { id } });
  });
}
