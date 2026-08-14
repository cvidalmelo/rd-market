import { NextResponse } from "next/server";
import { exigirAdminApi, responderError } from "@/lib/api-auth";
import { crearUsuario, listarUsuarios, normalizarUsuario } from "@/lib/usuarios";

export async function GET() {
  try {
    await exigirAdminApi();

    return NextResponse.json(await listarUsuarios());
  } catch (error) {
    return responderError(error);
  }
}

export async function POST(request: Request) {
  try {
    await exigirAdminApi();

    const cuerpo = (await request.json()) as Record<string, unknown>;
    const usuario = await crearUsuario(normalizarUsuario(cuerpo));

    return NextResponse.json(usuario, { status: 201 });
  } catch (error) {
    return responderError(error);
  }
}
