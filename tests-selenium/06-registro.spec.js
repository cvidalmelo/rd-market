import { expect } from "chai";
import { By, until } from "selenium-webdriver";
import { URL_BASE, navegador } from "./soporte/navegador.js";
import { USUARIO, correoUnico } from "./soporte/datos.js";
import PaginaRegistro from "./paginas/PaginaRegistro.js";

describe("HU-06 Registrarme con email y contrasena", function () {
  it("CP-12 (feliz) crea una cuenta nueva y entra con el rol de cliente", async function () {
    const driver = navegador();
    const registro = new PaginaRegistro(driver);
    const email = correoUnico("cliente");

    await registro.registrarse("Cliente de prueba", email, "cliente1234");

    // El alta inicia sesion automaticamente y lleva a la portada.
    await driver.wait(until.urlIs(`${URL_BASE}/`), 15000);

    const barra = await driver.findElement(By.css("header")).getText();
    expect(barra).to.contain("Cliente de prueba");
    expect(barra).to.contain("Cerrar sesion");

    // Un cliente no tiene acceso a la administracion de usuarios.
    expect(barra).to.not.contain("Usuarios");

    const portada = await driver.findElement(By.css("main")).getText();
    expect(portada).to.contain("rol de cliente");
  });

  it("CP-13 (negativa) rechaza un email que ya esta registrado", async function () {
    const driver = navegador();
    const registro = new PaginaRegistro(driver);

    await registro.registrarse("Ana Duplicada", USUARIO.email, "otraclave123");

    await driver.wait(until.urlContains("/registro"), 15000);
    expect(await registro.mensajeError()).to.equal(
      "Ya existe un usuario registrado con ese email.",
    );

    // No se ha iniciado ninguna sesion: la portada sigue siendo inaccesible.
    await driver.get(`${URL_BASE}/`);
    await driver.wait(until.urlContains("/login"), 15000);
  });
});
