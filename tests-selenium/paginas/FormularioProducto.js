import { By, until } from "selenium-webdriver";

const MENSAJE_ERROR = By.css("p.bg-red-50");

const CAMPOS = {
  nombre: By.id("nombre"),
  descripcion: By.id("descripcion"),
  precio: By.id("precio"),
  stock: By.id("stock"),
  categoria: By.id("categoria"),
};

/** Formulario compartido por el alta y la edicion de productos. */
export default class FormularioProducto {
  constructor(driver) {
    this.driver = driver;
  }

  async escribir(campo, valor) {
    const elemento = await this.driver.findElement(CAMPOS[campo]);
    await elemento.clear();

    if (valor !== "") {
      await elemento.sendKeys(valor);
    }
  }

  async valorDe(campo) {
    const elemento = await this.driver.findElement(CAMPOS[campo]);
    return elemento.getAttribute("value");
  }

  async rellenar(datos) {
    for (const [campo, valor] of Object.entries(datos)) {
      await this.escribir(campo, String(valor));
    }
  }

  async enviar(textoBoton) {
    const boton = await this.driver.findElement(
      By.xpath(`//button[normalize-space()='${textoBoton}']`),
    );
    await boton.click();
  }

  async mensajeError() {
    const mensaje = await this.driver.wait(until.elementLocated(MENSAJE_ERROR), 10000);
    return mensaje.getText();
  }

  /** Mensaje de validacion nativa del navegador para un campo. */
  async validacionNativa(campo) {
    const elemento = await this.driver.findElement(CAMPOS[campo]);
    return this.driver.executeScript("return arguments[0].validationMessage;", elemento);
  }
}
