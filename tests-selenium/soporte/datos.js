import { URL_BASE } from "./navegador.js";

/** Usuario cargado por `prisma/seed.ts`. */
export const USUARIO = {
  nombre: "Ana Perez",
  email: "ana@minimarket.com",
  password: "ana1234",
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
 * Alta de un producto por la API REST. Se usa solo para preparar el escenario de
 * las pruebas de edicion y borrado: lo que se automatiza por la interfaz es la
 * operacion bajo prueba, no su montaje.
 */
export async function crearProductoViaApi(datos) {
  const respuesta = await fetch(`${URL_BASE}/api/productos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos),
  });

  if (!respuesta.ok) {
    throw new Error(`No se pudo preparar el producto de prueba: ${respuesta.status}`);
  }

  return respuesta.json();
}
