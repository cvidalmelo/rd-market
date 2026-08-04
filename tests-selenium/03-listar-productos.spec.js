import { expect } from "chai";
import { until } from "selenium-webdriver";
import { URL_BASE, navegador } from "./soporte/navegador.js";
import { PRODUCTO_SEED } from "./soporte/datos.js";
import PaginaLogin from "./paginas/PaginaLogin.js";
import PaginaProductos from "./paginas/PaginaProductos.js";

describe("HU-03 Consultar el listado de productos", function () {
  it("CP-07 (feliz) muestra la tabla con sus columnas y los datos de cada producto", async function () {
    const driver = navegador();
    const productos = new PaginaProductos(driver);

    await new PaginaLogin(driver).iniciarSesionValida();
    await productos.abrir();

    // La cabecera se compara en minusculas porque la hoja de estilos la pinta
    // en mayusculas y `getText()` devuelve el texto ya renderizado.
    const encabezados = await productos.encabezados();
    expect(encabezados.map((texto) => texto.toLowerCase())).to.deep.equal([
      "nombre",
      "categoria",
      "precio",
      "stock",
      "acciones",
    ]);

    expect(await productos.contarFilas()).to.be.at.least(4);

    const fila = await productos.datosDe(PRODUCTO_SEED.nombre);
    expect(fila.categoria).to.equal(PRODUCTO_SEED.categoria);
    expect(fila.precio).to.equal(PRODUCTO_SEED.precio);
    expect(fila.stock).to.equal(PRODUCTO_SEED.stock);
  });

  it("CP-08 (negativa) redirige al login si se entra al listado sin sesion", async function () {
    const driver = navegador();

    await driver.get(`${URL_BASE}/productos`);

    await driver.wait(until.urlIs(`${URL_BASE}/login`), 15000);
    expect(await driver.getCurrentUrl()).to.equal(`${URL_BASE}/login`);
  });
});
