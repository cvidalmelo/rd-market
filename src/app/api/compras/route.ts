import { NextResponse } from "next/server";
import { crearCompra, listarCompras, normalizarCompra } from "@/lib/compras";
import { ErrorDeValidacion } from "@/lib/errores";

export async function GET() {
  const compras = await listarCompras();
  return NextResponse.json(compras);
}

export async function POST(request: Request) {
  const cuerpo = (await request.json()) as Record<string, unknown>;

  try {
    const compra = await crearCompra(normalizarCompra(cuerpo));
    return NextResponse.json(compra, { status: 201 });
  } catch (error) {
    if (error instanceof ErrorDeValidacion) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    throw error;
  }
}
