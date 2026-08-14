import { URL_BASE } from "./navegador.js";

/** Administradora cargada por `prisma/seed.ts`. */
export const USUARIO = {
  nombre: "Ana Perez",
  email: "ana@minimarket.com",
  password: "ana1234",
};

/** Cliente sin permisos de administracion, tambien del seed. */
export const USUARIO_NORMAL = {
  nombre: "Carlos Vidal",
  email: "carlos@minimarket.com",
  password: "carlos1234",
};

/** Producto del seed que se usa para comprobar el listado. */
export const PRODUCTO_SEED = {
  nombre: "Arroz 1kg",
  categoria: "Granos",
  precio: "$1.75",
  stock: "40",
};

/** Nombre unico, para que dos corridas seguidas no choquen entre si. */
export function nombreUnico(prefijo) {
  return `${prefijo} ${Date.now()}`;
}

/**
 * Inicia sesion contra Better Auth y devuelve la cookie lista para reenviar en
 * la cabecera `Cookie`. La API esta protegida, asi que cualquier preparativo por
 * REST tiene que autenticarse igual que lo haria una persona.
 */
export async function cookieDeSesion(usuario = USUARIO) {
  const respuesta = await fetch(`${URL_BASE}/api/auth/sign-in/email`, {
    method: "POST",
    // Better Auth rechaza las peticiones sin `Origin`; `fetch` de Node no lo
    // envia, asi que se declara el mismo que mandaria el navegador.
    headers: { "Content-Type": "application/json", Origin: URL_BASE },
    body: JSON.stringify({ email: usuario.email, password: usuario.password }),
  });

  if (!respuesta.ok) {
    throw new Error(`No se pudo iniciar sesion como ${usuario.email}: ${respuesta.status}`);
  }

  return respuesta.headers
    .getSetCookie()
    .map((cookie) => cookie.split(";")[0])
    .join("; ");
}

/**
 * Alta de un producto por la API REST, como administradora. Se usa solo para
 * preparar el escenario de las pruebas de edicion y borrado: lo que se automatiza
 * por la interfaz es la operacion bajo prueba, no su montaje.
 */
export async function crearProductoViaApi(datos) {
  const respuesta = await fetch(`${URL_BASE}/api/productos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Origin: URL_BASE,
      Cookie: await cookieDeSesion(USUARIO),
    },
    body: JSON.stringify(datos),
  });

  if (!respuesta.ok) {
    throw new Error(`No se pudo preparar el producto de prueba: ${respuesta.status}`);
  }

  return respuesta.json();
}
