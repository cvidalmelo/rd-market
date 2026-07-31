import { NextResponse } from "next/server";
import { ErrorDeValidacion } from "@/lib/errores";
import { crearProducto, listarProductos, normalizarProducto } from "@/lib/productos";

export async function GET() {
  const productos = await listarProductos();
  return NextResponse.json(productos);
}

export async function POST(request: Request) {
  const cuerpo = (await request.json()) as Record<string, unknown>;

  try {
    const producto = await crearProducto(normalizarProducto(cuerpo));
    return NextResponse.json(producto, { status: 201 });
  } catch (error) {
    if (error instanceof ErrorDeValidacion) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    throw error;
  }
}
