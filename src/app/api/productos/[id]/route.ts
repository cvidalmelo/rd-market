import { NextResponse } from "next/server";
import { exigirAdminApi, exigirSesionApi, responderError } from "@/lib/api-auth";
import {
  actualizarProducto,
  eliminarProducto,
  normalizarProducto,
  obtenerProducto,
} from "@/lib/productos";

type Contexto = { params: Promise<{ id: string }> };

export async function GET(request: Request, { params }: Contexto) {
  try {
    await exigirSesionApi();

    const { id } = await params;
    const producto = await obtenerProducto(id);

    if (!producto) {
      return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 });
    }

    return NextResponse.json(producto);
  } catch (error) {
    return responderError(error);
  }
}

export async function PUT(request: Request, { params }: Contexto) {
  try {
    await exigirAdminApi();

    const { id } = await params;
    const cuerpo = (await request.json()) as Record<string, unknown>;

    return NextResponse.json(await actualizarProducto(id, normalizarProducto(cuerpo)));
  } catch (error) {
    return responderError(error);
  }
}

export async function DELETE(request: Request, { params }: Contexto) {
  try {
    await exigirAdminApi();

    const { id } = await params;
    await eliminarProducto(id);

    return NextResponse.json({ ok: true });
  } catch (error) {
    return responderError(error);
  }
}
