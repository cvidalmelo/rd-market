import { redirect } from "next/navigation";
import { ErrorDeValidacion } from "./errores";

/**
 * Ejecuta una operacion de escritura y, si falla por validacion, vuelve al
 * formulario indicado mostrando el mensaje en pantalla.
 */
export async function conManejoDeError<T>(ruta: string, operacion: () => Promise<T>) {
  try {
    return await operacion();
  } catch (error) {
    if (error instanceof ErrorDeValidacion) {
      const separador = ruta.includes("?") ? "&" : "?";
      redirect(`${ruta}${separador}error=${encodeURIComponent(error.message)}`);
    }

    throw error;
  }
}
