import prisma from "./prisma";
import { ErrorDeAutorizacion, ErrorDeValidacion } from "./errores";
import { esAdmin } from "./roles";

/** Lo minimo que hace falta saber del usuario para decidir que compras ve. */
export type UsuarioDeSesion = { id: string; role?: string | null };

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

/**
 * Las compras son privadas: un cliente solo ve las suyas y el administrador
 * ve las de todos.
 */
export function listarCompras(usuario: UsuarioDeSesion) {
  return prisma.compra.findMany({
    where: esAdmin(usuario) ? undefined : { usuarioId: usuario.id },
    orderBy: { fecha: "desc" },
    include: { usuario: true, producto: true },
  });
}

export function contarCompras(usuario: UsuarioDeSesion) {
  return prisma.compra.count({
    where: esAdmin(usuario) ? undefined : { usuarioId: usuario.id },
  });
}

/** Comprueba que la compra existe y que el usuario tiene derecho a tocarla. */
export async function exigirCompraPropia(id: string, usuario: UsuarioDeSesion) {
  const compra = await prisma.compra.findUnique({ where: { id } });

  if (!compra) {
    throw new ErrorDeValidacion("La compra no existe.");
  }

  if (!esAdmin(usuario) && compra.usuarioId !== usuario.id) {
    throw new ErrorDeAutorizacion(403, "Solo puedes anular tus propias compras.");
  }

  return compra;
}

/**
 * Registra la compra y descuenta el stock del producto en una sola transaccion,
 * para que nunca quede una compra sin su descuento correspondiente.
 */
export async function crearCompra(entrada: DatosCompra, usuario: UsuarioDeSesion) {
  // Un cliente solo puede comprar a su nombre; el administrador elige a quien.
  const datos = esAdmin(usuario)
    ? entrada
    : { ...entrada, usuarioId: usuario.id };

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
export async function eliminarCompra(id: string, usuario: UsuarioDeSesion) {
  await exigirCompraPropia(id, usuario);

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
