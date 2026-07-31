import { NextResponse } from "next/server";
import { crearUsuario, listarUsuarios, normalizarUsuario } from "@/lib/usuarios";

export async function GET() {
  const usuarios = await listarUsuarios();
  return NextResponse.json(usuarios);
}

export async function POST(request: Request) {
  const cuerpo = (await request.json()) as Record<string, unknown>;
  const usuario = await crearUsuario(normalizarUsuario(cuerpo));
  return NextResponse.json(usuario, { status: 201 });
}
