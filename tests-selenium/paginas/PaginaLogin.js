import { By, until } from "selenium-webdriver";
import { URL_BASE } from "../soporte/navegador.js";
import { USUARIO } from "../soporte/datos.js";

const CAMPO_EMAIL = By.id("email");
const CAMPO_PASSWORD = By.id("password");
const BOTON_ENTRAR = By.xpath("//button[normalize-space()='Iniciar sesion']");
const MENSAJE_ERROR = By.css("p.bg-red-50");

export default class PaginaLogin {
  constructor(driver) {
    this.driver = driver;
  }

  async abrir() {
    await this.driver.get(`${URL_BASE}/login`);
    await this.driver.wait(until.elementLocated(BOTON_ENTRAR), 10000);
  }

  async rellenar(email, password) {
    const campoEmail = await this.driver.findElement(CAMPO_EMAIL);
    const campoPassword = await this.driver.findElement(CAMPO_PASSWORD);

    await campoEmail.clear();
    await campoEmail.sendKeys(email);
    await campoPassword.clear();
    await campoPassword.sendKeys(password);
  }

  async enviar() {
    await this.driver.findElement(BOTON_ENTRAR).click();
  }

  /** Camino completo: abrir, rellenar y enviar. */
  async iniciarSesion(email = USUARIO.email, password = USUARIO.password) {
    await this.abrir();
    await this.rellenar(email, password);
    await this.enviar();
  }

  /** Deja la sesion iniciada y espera a estar en la portada. */
  async iniciarSesionValida() {
    await this.iniciarSesion();
    await this.driver.wait(until.urlIs(`${URL_BASE}/`), 15000);
  }

  async mensajeError() {
    const mensaje = await this.driver.wait(until.elementLocated(MENSAJE_ERROR), 10000);
    return mensaje.getText();
  }

  /** Mensaje de validacion nativa del navegador para un campo obligatorio. */
  async validacionNativa(campo) {
    const localizador = campo === "email" ? CAMPO_EMAIL : CAMPO_PASSWORD;
    const elemento = await this.driver.findElement(localizador);

    return this.driver.executeScript("return arguments[0].validationMessage;", elemento);
  }
}
