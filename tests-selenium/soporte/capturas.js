import fs from "node:fs/promises";
import path from "node:path";
import addContext from "mochawesome/addContext.js";

export const DIR_REPORTES = path.resolve("tests-selenium/reportes");
export const DIR_CAPTURAS = path.join(DIR_REPORTES, "capturas");

/** Convierte el titulo de una prueba en un nombre de archivo utilizable. */
function nombreDeArchivo(titulo) {
  return titulo
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase()
    .slice(0, 90);
}

/**
 * Guarda una captura y la adjunta al reporte HTML.
 * La ruta que se adjunta es relativa al propio reporte, que vive en `DIR_REPORTES`.
 */
export async function capturar(driver, contexto, titulo) {
  await fs.mkdir(DIR_CAPTURAS, { recursive: true });

  const archivo = `${nombreDeArchivo(titulo)}.png`;
  const png = await driver.takeScreenshot();
  await fs.writeFile(path.join(DIR_CAPTURAS, archivo), png, "base64");

  if (contexto) {
    addContext(contexto, `capturas/${archivo}`);
  }

  return archivo;
}
