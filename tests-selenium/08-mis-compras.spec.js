import { expect } from "chai";
import { By, until } from "selenium-webdriver";
import { URL_BASE, navegador } from "./soporte/navegador.js";
import { USUARIO, USUARIO_NORMAL } from "./soporte/datos.js";
import PaginaLogin from "./paginas/PaginaLogin.js";

/** Texto de la tabla de compras, ya con la sesion iniciada. */
async function abrirCompras(driver) {
  await driver.get(`${URL_BASE}/compras`);
  await driver.wait(until.elementLocated(By.css("table")), 10000);

  return driver.findElement(By.css("main")).getText();
}

describe("HU-09 Ver unicamente mis compras", function () {
  it("CP-15 (feliz) el cliente solo ve sus compras y la administradora las ve todas", async function () {
    const driver = navegador();
    const login = new PaginaLogin(driver);

    // El seed deja una compra de cada usuario.
    await login.iniciarSesionValida(USUARIO_NORMAL);

    const comprasDelCliente = await abrirCompras(driver);
    expect(comprasDelCliente).to.contain("Mis compras");
    expect(comprasDelCliente).to.contain("Pan de molde");
    expect(comprasDelCliente).to.not.contain("Leche entera 1L");
    expect(comprasDelCliente).to.not.contain(USUARIO.email);

    const filasDelCliente = await driver.findElements(By.css("tbody tr"));
    expect(filasDelCliente).to.have.length(1);

    // La misma pantalla, vista por la administradora, muestra las de todos.
    // Se descarta la sesion borrando la cookie, sin depender del boton de la
    // barra: lo que se prueba aqui es el filtrado, no el cierre de sesion.
    await driver.manage().deleteAllCookies();
    await login.iniciarSesionValida(USUARIO);

    const comprasDeAdmin = await abrirCompras(driver);
    expect(comprasDeAdmin).to.contain("Pan de molde");
    expect(comprasDeAdmin).to.contain("Leche entera 1L");
    expect(comprasDeAdmin).to.contain(USUARIO_NORMAL.email);

    const filasDeAdmin = await driver.findElements(By.css("tbody tr"));
    expect(filasDeAdmin).to.have.length(2);
  });
});
