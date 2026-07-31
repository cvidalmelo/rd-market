import { NextResponse } from "next/server";
import { ErrorDeValidacion } from "@/lib/errores";
import { crearUsuario, listarUsuarios, normalizarUsuario } from "@/lib/usuarios";

export async function GET() {
  const usuarios = await listarUsuarios();
  return NextResponse.json(usuarios);
}

export async function POST(request: Request) {
  const cuerpo = (await request.json()) as Record<string, unknown>;

  try {
    const usuario = await crearUsuario(normalizarUsuario(cuerpo));
    return NextResponse.json(usuario, { status: 201 });
  } catch (error) {
    if (error instanceof ErrorDeValidacion) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    throw error;
  }
}
