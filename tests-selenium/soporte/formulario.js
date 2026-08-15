/**
 * Escritura fiable en un campo de formulario.
 *
 * Next entrega el HTML del servidor y React lo hidrata unos milisegundos
 * despues. Si Selenium teclea antes de la hidratacion, React repinta el campo y
 * el valor se pierde: el formulario se envia vacio y el navegador lo bloquea con
 * su validacion nativa. Por eso se comprueba que el valor haya quedado escrito y
 * se reintenta mientras no sea asi.
 */
/**
 * Pulsa un boton y espera a que se cumpla la condicion indicada.
 *
 * Mismo motivo que en `escribirCampo`: si la pulsacion llega mientras React
 * esta tomando el control del formulario, el envio se pierde sin dar ningun
 * aviso. Se reintenta hasta que la accion tenga efecto.
 */
export async function pulsarHasta(driver, localizador, condicion, intentos = 3, espera = 8000) {
  for (let intento = 1; intento <= intentos; intento += 1) {
    await driver.findElement(localizador).click();

    try {
      await driver.wait(condicion, espera);
      return;
    } catch (error) {
      if (intento === intentos) {
        throw error;
      }
    }
  }
}

export async function escribirCampo(driver, localizador, valor, espera = 10000) {
  let ultimoValor = null;

  await driver.wait(
    async () => {
      const campo = await driver.findElement(localizador);
      await campo.clear();

      if (valor !== "") {
        await campo.sendKeys(valor);
      }

      ultimoValor = await campo.getAttribute("value");

      return ultimoValor === valor;
    },
    espera,
    `No se pudo escribir "${valor}" en ${localizador}: el campo quedo con "${ultimoValor}".`,
  );
}
