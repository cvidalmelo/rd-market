import { expect } from "chai";
import { navegador } from "./soporte/navegador.js";
import { crearProductoViaApi, nombreUnico } from "./soporte/datos.js";
import PaginaLogin from "./paginas/PaginaLogin.js";
import PaginaProductos from "./paginas/PaginaProductos.js";

describe("HU-05 Eliminar un producto", function () {
  it("CP-11 (feliz) borra el producto y desaparece del listado", async function () {
    const driver = navegador();
    const productos = new PaginaProductos(driver);

    const nombre = nombreUnico("Producto descatalogado");
    await crearProductoViaApi({
      nombre,
      descripcion: null,
      precio: 1.2,
      stock: 3,
      categoria: "Varios",
    });

    await new PaginaLogin(driver).iniciarSesionValida();
    await productos.abrir();

    const filasAntes = await productos.contarFilas();
    expect(await productos.existeProducto(nombre)).to.equal(true);

    await productos.eliminar(nombre);

    expect(await productos.existeProducto(nombre)).to.equal(false);
    expect(await productos.contarFilas()).to.equal(filasAntes - 1);
  });
});
