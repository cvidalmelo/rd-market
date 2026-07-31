import { NextResponse } from "next/server";
import { eliminarCompra } from "@/lib/compras";
import { ErrorDeValidacion } from "@/lib/errores";

type Contexto = { params: Promise<{ id: string }> };

export async function DELETE(request: Request, { params }: Contexto) {
  const { id } = await params;

  try {
    await eliminarCompra(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof ErrorDeValidacion) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    throw error;
  }
}
