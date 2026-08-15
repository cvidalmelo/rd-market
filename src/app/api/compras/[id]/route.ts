import { NextResponse } from "next/server";
import { exigirSesionApi, responderError } from "@/lib/api-auth";
import { eliminarCompra } from "@/lib/compras";

type Contexto = { params: Promise<{ id: string }> };

export async function DELETE(request: Request, { params }: Contexto) {
  try {
    const { user } = await exigirSesionApi();

    const { id } = await params;
    await eliminarCompra(id, user);

    return NextResponse.json({ ok: true });
  } catch (error) {
    return responderError(error, 404);
  }
}
