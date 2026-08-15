import { NextResponse } from "next/server";
import { exigirAdminApi, responderError } from "@/lib/api-auth";
import {
  actualizarUsuario,
  eliminarUsuario,
  normalizarUsuario,
  obtenerUsuario,
} from "@/lib/usuarios";

type Contexto = { params: Promise<{ id: string }> };

export async function GET(request: Request, { params }: Contexto) {
  try {
    await exigirAdminApi();

    const { id } = await params;
    const usuario = await obtenerUsuario(id);

    if (!usuario) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    return NextResponse.json(usuario);
  } catch (error) {
    return responderError(error);
  }
}

export async function PUT(request: Request, { params }: Contexto) {
  try {
    await exigirAdminApi();

    const { id } = await params;
    const cuerpo = (await request.json()) as Record<string, unknown>;

    return NextResponse.json(await actualizarUsuario(id, normalizarUsuario(cuerpo)));
  } catch (error) {
    return responderError(error);
  }
}

export async function DELETE(request: Request, { params }: Contexto) {
  try {
    await exigirAdminApi();

    const { id } = await params;
    await eliminarUsuario(id);

    return NextResponse.json({ ok: true });
  } catch (error) {
    return responderError(error);
  }
}
