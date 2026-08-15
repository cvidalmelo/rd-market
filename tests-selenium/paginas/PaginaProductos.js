import { By, until } from "selenium-webdriver";
import { URL_BASE } from "../soporte/navegador.js";

const TITULO = By.xpath("//h1[normalize-space()='Productos']");
const BOTON_NUEVO = By.xpath("//a[normalize-space()='Nuevo producto']");
const ENCABEZADOS = By.css("thead th");
const FILAS = By.css("tbody tr");

/** Fila de la tabla cuya primera celda contiene el nombre indicado. */
function filaDe(nombre) {
  return By.xpath(`//tbody/tr[td[1][contains(., "${nombre}")]]`);
}

export default class PaginaProductos {
  constructor(driver) {
    this.driver = driver;
  }

  async abrir() {
    await this.driver.get(`${URL_BASE}/productos`);
    await this.driver.wait(until.elementLocated(TITULO), 10000);
  }

  async pulsarNuevoProducto() {
    await this.driver.findElement(BOTON_NUEVO).click();
    await this.driver.wait(until.urlIs(`${URL_BASE}/productos/nuevo`), 10000);
  }

  async encabezados() {
    const celdas = await this.driver.findElements(ENCABEZADOS);
    return Promise.all(celdas.map((celda) => celda.getText()));
  }

  async contarFilas() {
    const filas = await this.driver.findElements(FILAS);
    return filas.length;
  }

  async existeProducto(nombre) {
    const filas = await this.driver.findElements(filaDe(nombre));
    return filas.length > 0;
  }

  async esperarProducto(nombre) {
    await this.driver.wait(until.elementLocated(filaDe(nombre)), 10000);
  }

  /** Devuelve las celdas de la fila del producto: nombre, categoria, precio y stock. */
  async datosDe(nombre) {
    const fila = await this.driver.wait(until.elementLocated(filaDe(nombre)), 10000);
    const celdas = await fila.findElements(By.css("td"));
    const textos = await Promise.all(celdas.map((celda) => celda.getText()));

    return {
      nombre: textos[0],
      categoria: textos[1],
      precio: textos[2],
      stock: textos[3],
    };
  }

  async pulsarEditar(nombre) {
    const fila = await this.driver.wait(until.elementLocated(filaDe(nombre)), 10000);
    await fila.findElement(By.xpath(".//a[normalize-space()='Editar']")).click();
    await this.driver.wait(until.elementLocated(By.id("nombre")), 10000);
  }

  /** Pulsa Eliminar en la fila indicada y espera a que la fila desaparezca. */
  async eliminar(nombre) {
    const fila = await this.driver.wait(until.elementLocated(filaDe(nombre)), 10000);
    await fila.findElement(By.xpath(".//button[normalize-space()='Eliminar']")).click();
    await this.driver.wait(async () => !(await this.existeProducto(nombre)), 10000);
  }
}
