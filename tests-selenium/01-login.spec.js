import { expect } from "chai";
import { By, until } from "selenium-webdriver";
import { URL_BASE, navegador } from "./soporte/navegador.js";
import { USUARIO } from "./soporte/datos.js";
import PaginaLogin from "./paginas/PaginaLogin.js";

describe("HU-01 Iniciar sesion en MiniMarket", function () {
  it("CP-01 (feliz) permite entrar con credenciales validas y muestra el usuario en la barra", async function () {
    const driver = navegador();
    const login = new PaginaLogin(driver);

    await login.iniciarSesion(USUARIO.email, USUARIO.password);

    await driver.wait(until.urlIs(`${URL_BASE}/`), 15000);

    const barra = await driver.findElement(By.css("header")).getText();
    expect(barra).to.contain(USUARIO.nombre);
    expect(barra).to.contain("Cerrar sesion");
  });

  it("CP-02 (negativa) rechaza una contrasena incorrecta y no inicia sesion", async function () {
    const driver = navegador();
    const login = new PaginaLogin(driver);

    await login.iniciarSesion(USUARIO.email, "clave-incorrecta");

    await driver.wait(until.urlContains("/login"), 15000);
    expect(await login.mensajeError()).to.equal("Credenciales invalidas.");

    // Sin sesion, una ruta protegida sigue devolviendo al login.
    await driver.get(`${URL_BASE}/productos`);
    await driver.wait(until.urlContains("/login"), 15000);
  });

  it("CP-03 (limites) no envia el formulario con los campos obligatorios vacios", async function () {
    const driver = navegador();
    const login = new PaginaLogin(driver);

    await login.abrir();
    await login.enviar();

    expect(await driver.getCurrentUrl()).to.equal(`${URL_BASE}/login`);
    expect(await login.validacionNativa("email")).to.have.length.above(0);

    // Con el email puesto, el bloqueo se traslada a la contrasena.
    await login.rellenar(USUARIO.email, "");
    await login.enviar();

    expect(await driver.getCurrentUrl()).to.equal(`${URL_BASE}/login`);
    expect(await login.validacionNativa("password")).to.have.length.above(0);
  });
});
