import { NextResponse } from "next/server";
import { ErrorDeValidacion } from "@/lib/errores";
import {
  actualizarProducto,
  eliminarProducto,
  normalizarProducto,
  obtenerProducto,
} from "@/lib/productos";

type Contexto = { params: Promise<{ id: string }> };

export async function GET(request: Request, { params }: Contexto) {
  const { id } = await params;
  const producto = await obtenerProducto(id);

  if (!producto) {
    return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 });
  }

  return NextResponse.json(producto);
}

export async function PUT(request: Request, { params }: Contexto) {
  const { id } = await params;
  const cuerpo = (await request.json()) as Record<string, unknown>;

  try {
    const producto = await actualizarProducto(id, normalizarProducto(cuerpo));
    return NextResponse.json(producto);
  } catch (error) {
    if (error instanceof ErrorDeValidacion) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    throw error;
  }
}

export async function DELETE(request: Request, { params }: Contexto) {
  const { id } = await params;
  await eliminarProducto(id);
  return NextResponse.json({ ok: true });
}
