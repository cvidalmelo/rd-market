import { NextResponse } from "next/server";
import { exigirAdminApi, exigirSesionApi, responderError } from "@/lib/api-auth";
import { crearProducto, listarProductos, normalizarProducto } from "@/lib/productos";

export async function GET() {
  try {
    await exigirSesionApi();

    return NextResponse.json(await listarProductos());
  } catch (error) {
    return responderError(error);
  }
}

export async function POST(request: Request) {
  try {
    await exigirAdminApi();

    const cuerpo = (await request.json()) as Record<string, unknown>;
    const producto = await crearProducto(normalizarProducto(cuerpo));

    return NextResponse.json(producto, { status: 201 });
  } catch (error) {
    return responderError(error);
  }
}
