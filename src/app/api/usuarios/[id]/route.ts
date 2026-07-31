import { NextResponse } from "next/server";
import { ErrorDeValidacion } from "@/lib/errores";
import {
  actualizarUsuario,
  eliminarUsuario,
  normalizarUsuario,
  obtenerUsuario,
} from "@/lib/usuarios";

type Contexto = { params: Promise<{ id: string }> };

export async function GET(request: Request, { params }: Contexto) {
  const { id } = await params;
  const usuario = await obtenerUsuario(id);

  if (!usuario) {
    return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
  }

  return NextResponse.json(usuario);
}

export async function PUT(request: Request, { params }: Contexto) {
  const { id } = await params;
  const cuerpo = (await request.json()) as Record<string, unknown>;

  try {
    const usuario = await actualizarUsuario(id, normalizarUsuario(cuerpo));
    return NextResponse.json(usuario);
  } catch (error) {
    if (error instanceof ErrorDeValidacion) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    throw error;
  }
}

export async function DELETE(request: Request, { params }: Contexto) {
  const { id } = await params;
  await eliminarUsuario(id);
  return NextResponse.json({ ok: true });
}
