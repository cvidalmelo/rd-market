import { NextResponse, type NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

/**
 * En Next 16 el antiguo `middleware.ts` se llama `proxy.ts`.
 *
 * Aqui solo se comprueba que exista la cookie de sesion de Better Auth: el
 * proxy se ejecuta en cada peticion (incluidas las precargas de los enlaces),
 * asi que no debe consultar la base de datos. La verificacion definitiva, con
 * su rol, esta en `lib/dal.ts` y en `lib/api-auth.ts`.
 */

const RUTAS_PUBLICAS = ["/login", "/registro"];

export default function proxy(request: NextRequest) {
  const ruta = request.nextUrl.pathname;
  const esPublica = RUTAS_PUBLICAS.includes(ruta);
  const cookieDeSesion = getSessionCookie(request);

  if (!esPublica && !cookieDeSesion) {
    return NextResponse.redirect(new URL("/login", request.nextUrl));
  }

  if (esPublica && cookieDeSesion) {
    return NextResponse.redirect(new URL("/", request.nextUrl));
  }

  return NextResponse.next();
}

// `/api` queda fuera del matcher: los endpoints de Better Auth viven en
// /api/auth/* y cada route handler comprueba su propia sesion y rol.
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
