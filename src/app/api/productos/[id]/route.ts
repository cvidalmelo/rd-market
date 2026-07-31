import { NextResponse } from "next/server";
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
  const producto = await actualizarProducto(id, normalizarProducto(cuerpo));
  return NextResponse.json(producto);
}

export async function DELETE(request: Request, { params }: Contexto) {
  const { id } = await params;
  await eliminarProducto(id);
  return NextResponse.json({ ok: true });
}
