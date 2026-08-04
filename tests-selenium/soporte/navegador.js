import { Builder, Browser } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome.js";

export const URL_BASE = process.env.URL_BASE ?? "http://localhost:3000";

/**
 * Los hooks globales crean un navegador nuevo por cada caso y lo dejan aqui,
 * para que las pruebas lo tomen con `navegador()`. Empezar siempre con un perfil
 * limpio garantiza que ninguna sesion se filtre de un caso al siguiente.
 */
let driverActual = null;

export function navegador() {
  if (!driverActual) {
    throw new Error("No hay navegador activo: los hooks globales no se ejecutaron.");
  }

  return driverActual;
}

export async function abrirNavegador() {
  const opciones = new chrome.Options();
  opciones.addArguments("--window-size=1440,900");
  opciones.addArguments("--lang=es");

  if (process.env.HEADLESS === "1") {
    opciones.addArguments("--headless=new");
  }

  driverActual = await new Builder()
    .forBrowser(Browser.CHROME)
    .setChromeOptions(opciones)
    .build();

  return driverActual;
}

export async function cerrarNavegador() {
  if (driverActual) {
    await driverActual.quit();
    driverActual = null;
  }
}
