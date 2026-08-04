import { expect } from "chai";
import { until } from "selenium-webdriver";
import { URL_BASE, navegador } from "./soporte/navegador.js";
import { crearProductoViaApi, nombreUnico } from "./soporte/datos.js";
import PaginaLogin from "./paginas/PaginaLogin.js";
import PaginaProductos from "./paginas/PaginaProductos.js";
import FormularioProducto from "./paginas/FormularioProducto.js";

describe("HU-04 Editar un producto existente", function () {
  let driver;
  let productos;
  let formulario;
  let nombre;

  beforeEach(async function () {
    driver = navegador();
    productos = new PaginaProductos(driver);
    formulario = new FormularioProducto(driver);

    // El montaje del escenario se hace por la API; lo que se prueba por la
    // interfaz es la edicion.
    nombre = nombreUnico("Cafe molido");
    await crearProductoViaApi({
      nombre,
      descripcion: "Bolsa de 250g",
      precio: 6.5,
      stock: 10,
      categoria: "Bebidas",
    });

    await new PaginaLogin(driver).iniciarSesionValida();
    await productos.abrir();
    await productos.pulsarEditar(nombre);
  });

  it("CP-09 (feliz) guarda el nuevo precio y stock y los refleja en el listado", async function () {
    await formulario.rellenar({ precio: "7.25", stock: "33" });
    await formulario.enviar("Guardar cambios");

    await driver.wait(until.urlIs(`${URL_BASE}/productos`), 15000);

    const fila = await productos.datosDe(nombre);
    expect(fila.precio).to.equal("$7.25");
    expect(fila.stock).to.equal("33");
  });

  it("CP-10 (negativa) no guarda si se deja el nombre vacio y conserva el valor original", async function () {
    await formulario.escribir("nombre", "");
    await formulario.enviar("Guardar cambios");

    // El navegador bloquea el envio: no hay navegacion.
    expect(await driver.getCurrentUrl()).to.contain("/editar");
    expect(await formulario.validacionNativa("nombre")).to.have.length.above(0);

    await productos.abrir();
    expect(await productos.existeProducto(nombre)).to.equal(true);
  });
});
