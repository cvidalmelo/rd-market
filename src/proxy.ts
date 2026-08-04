import { NextResponse, type NextRequest } from "next/server";
import { COOKIE_SESION, descifrarSesion } from "@/lib/sesion-token";

/**
 * En Next 16 el antiguo `middleware.ts` se llama `proxy.ts`.
 *
 * Aqui solo se hace una comprobacion optimista leyendo la cookie: el proxy se
 * ejecuta en cada peticion (incluidas las precargas de los enlaces), asi que no
 * debe consultar la base de datos. La verificacion definitiva esta en `lib/dal.ts`.
 */

const RUTAS_PUBLICAS = ["/login"];

export default async function proxy(request: NextRequest) {
  const ruta = request.nextUrl.pathname;
  const esPublica = RUTAS_PUBLICAS.includes(ruta);
  const sesion = await descifrarSesion(request.cookies.get(COOKIE_SESION)?.value);

  if (!esPublica && !sesion) {
    return NextResponse.redirect(new URL("/login", request.nextUrl));
  }

  if (esPublica && sesion) {
    return NextResponse.redirect(new URL("/", request.nextUrl));
  }

  return NextResponse.next();
}

// La API REST queda fuera para no romper los endpoints de la entrega anterior.
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
