import { expect } from "chai";
import { By, until } from "selenium-webdriver";
import { URL_BASE, navegador } from "./soporte/navegador.js";
import { USUARIO_NORMAL } from "./soporte/datos.js";
import PaginaLogin from "./paginas/PaginaLogin.js";
import PaginaProductos from "./paginas/PaginaProductos.js";

describe("HU-08 y HU-10 Permisos del cliente frente al administrador", function () {
  beforeEach(async function () {
    await new PaginaLogin(navegador()).iniciarSesionValida(USUARIO_NORMAL);
  });

  it("CP-14 (negativa) un cliente no puede entrar en la administracion de usuarios", async function () {
    const driver = navegador();

    // El enlace ni siquiera se le ofrece en la barra de navegacion.
    const barra = await driver.findElement(By.css("header")).getText();
    expect(barra).to.contain(USUARIO_NORMAL.nombre);
    expect(barra).to.not.contain("Usuarios");

    // Y si escribe la ruta a mano, vuelve al inicio con el aviso.
    await driver.get(`${URL_BASE}/usuarios`);
    await driver.wait(until.urlContains("/?error="), 15000);

    const aviso = await driver.wait(until.elementLocated(By.css("p.bg-red-50")), 10000);
    expect(await aviso.getText()).to.equal(
      "Necesitas permisos de administrador para entrar ahi.",
    );

    await driver.get(`${URL_BASE}/usuarios/nuevo`);
    await driver.wait(until.urlContains("/?error="), 15000);
  });

  it("CP-16 (negativa) un cliente ve el catalogo pero no puede modificarlo", async function () {
    const driver = navegador();
    const productos = new PaginaProductos(driver);

    await productos.abrir();

    // La tabla pierde la columna de acciones cuando no hay permisos.
    const encabezados = await productos.encabezados();
    expect(encabezados.map((texto) => texto.toLowerCase())).to.deep.equal([
      "nombre",
      "categoria",
      "precio",
      "stock",
    ]);

    expect(await productos.contarFilas()).to.be.at.least(4);

    const pagina = await driver.findElement(By.css("main")).getText();
    expect(pagina).to.not.contain("Nuevo producto");
    expect(pagina).to.not.contain("Eliminar");

    expect(await driver.findElements(By.xpath("//a[normalize-space()='Editar']"))).to.have
      .length(0);

    // La ruta de alta tampoco es accesible escribiendola a mano.
    await driver.get(`${URL_BASE}/productos/nuevo`);
    await driver.wait(until.urlContains("/?error="), 15000);
  });
});
