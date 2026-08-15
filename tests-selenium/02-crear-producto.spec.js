import { expect } from "chai";
import { until } from "selenium-webdriver";
import { URL_BASE, navegador } from "./soporte/navegador.js";
import { nombreUnico } from "./soporte/datos.js";
import PaginaLogin from "./paginas/PaginaLogin.js";
import PaginaProductos from "./paginas/PaginaProductos.js";
import FormularioProducto from "./paginas/FormularioProducto.js";

describe("HU-02 Crear un producto", function () {
  let driver;
  let productos;
  let formulario;

  beforeEach(async function () {
    driver = navegador();
    productos = new PaginaProductos(driver);
    formulario = new FormularioProducto(driver);

    await new PaginaLogin(driver).iniciarSesionValida();
    await productos.abrir();
    await productos.pulsarNuevoProducto();
  });

  it("CP-04 (feliz) crea un producto valido y lo muestra en el listado", async function () {
    const nombre = nombreUnico("Galletas de avena");

    await formulario.rellenar({
      nombre,
      descripcion: "Paquete de 300g",
      precio: "4.75",
      stock: "15",
      categoria: "Panaderia",
    });
    await formulario.enviar("Crear producto");

    await driver.wait(until.urlIs(`${URL_BASE}/productos`), 15000);

    const fila = await productos.datosDe(nombre);
    expect(fila.nombre).to.contain(nombre);
    expect(fila.categoria).to.equal("Panaderia");
    expect(fila.precio).to.equal("$4.75");
    expect(fila.stock).to.equal("15");
  });

  it("CP-05 (negativa) rechaza un nombre que solo tiene espacios", async function () {
    // Los espacios superan el `required` del navegador, pero el servidor los descarta.
    await formulario.rellenar({
      nombre: "   ",
      precio: "3.00",
      stock: "5",
    });
    await formulario.enviar("Crear producto");

    await driver.wait(until.urlContains("/productos/nuevo?error="), 15000);
    expect(await formulario.mensajeError()).to.equal("El nombre del producto es obligatorio.");
  });

  it("CP-06 (limites) acepta precio y stock en cero, que es el minimo permitido", async function () {
    const nombre = nombreUnico("Muestra gratis");

    await formulario.rellenar({
      nombre,
      precio: "0",
      stock: "0",
      categoria: "Promociones",
    });
    await formulario.enviar("Crear producto");

    await driver.wait(until.urlIs(`${URL_BASE}/productos`), 15000);

    const fila = await productos.datosDe(nombre);
    expect(fila.precio).to.equal("$0.00");
    expect(fila.stock).to.equal("0");
  });
});
