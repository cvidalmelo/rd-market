import { By, until } from "selenium-webdriver";
import { URL_BASE } from "../soporte/navegador.js";
import { escribirCampo, pulsarHasta } from "../soporte/formulario.js";

const CAMPO_NOMBRE = By.id("nombre");
const CAMPO_EMAIL = By.id("email");
const CAMPO_PASSWORD = By.id("password");
const BOTON_CREAR = By.xpath("//button[normalize-space()='Crear cuenta']");
const MENSAJE_ERROR = By.css("p.bg-red-50");

export default class PaginaRegistro {
  constructor(driver) {
    this.driver = driver;
  }

  async abrir() {
    await this.driver.get(`${URL_BASE}/registro`);
    await this.driver.wait(until.elementLocated(BOTON_CREAR), 10000);
  }

  async rellenar(nombre, email, password) {
    await escribirCampo(this.driver, CAMPO_NOMBRE, nombre);
    await escribirCampo(this.driver, CAMPO_EMAIL, email);
    await escribirCampo(this.driver, CAMPO_PASSWORD, password);
  }

  async enviar() {
    await this.driver.findElement(BOTON_CREAR).click();
  }

  /**
   * Camino completo: abrir, rellenar y enviar, esperando a que el alta tenga
   * efecto (portada si sale bien, mensaje de error si no).
   */
  async registrarse(nombre, email, password) {
    await this.abrir();
    await this.rellenar(nombre, email, password);
    await pulsarHasta(this.driver, BOTON_CREAR, async (driver) => {
      const url = await driver.getCurrentUrl();
      if (url === `${URL_BASE}/`) {
        return true;
      }

      return (await driver.findElements(MENSAJE_ERROR)).length > 0;
    });
  }

  async mensajeError() {
    const mensaje = await this.driver.wait(until.elementLocated(MENSAJE_ERROR), 10000);
    return mensaje.getText();
  }
}
