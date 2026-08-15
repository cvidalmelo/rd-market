import { NextResponse } from "next/server";
import { exigirSesionApi, responderError } from "@/lib/api-auth";
import { crearCompra, listarCompras, normalizarCompra } from "@/lib/compras";

export async function GET() {
  try {
    const { user } = await exigirSesionApi();

    return NextResponse.json(await listarCompras(user));
  } catch (error) {
    return responderError(error);
  }
}

export async function POST(request: Request) {
  try {
    const { user } = await exigirSesionApi();

    const cuerpo = (await request.json()) as Record<string, unknown>;
    const compra = await crearCompra(normalizarCompra(cuerpo), user);

    return NextResponse.json(compra, { status: 201 });
  } catch (error) {
    return responderError(error);
  }
}
