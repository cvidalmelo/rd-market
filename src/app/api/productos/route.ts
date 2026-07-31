import { NextResponse } from "next/server";
import { crearProducto, listarProductos, normalizarProducto } from "@/lib/productos";

export async function GET() {
  const productos = await listarProductos();
  return NextResponse.json(productos);
}

export async function POST(request: Request) {
  const cuerpo = (await request.json()) as Record<string, unknown>;
  const producto = await crearProducto(normalizarProducto(cuerpo));
  return NextResponse.json(producto, { status: 201 });
}
