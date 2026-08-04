import { execFile } from "node:child_process";
import { promisify } from "node:util";
import fs from "node:fs/promises";
import { URL_BASE, abrirNavegador, cerrarNavegador, navegador } from "./navegador.js";
import { DIR_CAPTURAS, capturar } from "./capturas.js";

const ejecutar = promisify(execFile);

async function comprobarQueLaAppResponde() {
  try {
    await fetch(`${URL_BASE}/login`);
  } catch {
    throw new Error(
      `No hay respuesta en ${URL_BASE}. Levanta la aplicacion con "npm run dev" antes de correr las pruebas.`,
    );
  }
}

/**
 * Hooks globales de Mocha.
 *
 * - Antes de todo: se deja la base de datos en un estado conocido con el seed.
 * - Antes de cada caso: navegador nuevo, sin cookies heredadas del caso anterior.
 * - Despues de cada caso: captura de pantalla (pase o falle) adjunta al reporte.
 */
export const mochaHooks = {
  async beforeAll() {
    this.timeout(120000);

    await comprobarQueLaAppResponde();
    await fs.rm(DIR_CAPTURAS, { recursive: true, force: true });
    await ejecutar("npm", ["run", "db:seed"]);
  },

  async beforeEach() {
    this.timeout(60000);
    await abrirNavegador();
  },

  async afterEach() {
    this.timeout(60000);

    try {
      await capturar(navegador(), this, this.currentTest.title);
    } catch (error) {
      console.error("No se pudo tomar la captura:", error.message);
    }

    await cerrarNavegador();
  },
};
