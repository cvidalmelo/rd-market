/** Error de negocio cuyo mensaje se puede mostrar directamente al usuario. */
export class ErrorDeValidacion extends Error {
  constructor(mensaje: string) {
    super(mensaje);
    this.name = "ErrorDeValidacion";
  }
}

/**
 * Falta de sesion (401) o de permisos (403). Lo usan los route handlers para
 * devolver el codigo correcto sin repetir la comprobacion en cada uno.
 */
export class ErrorDeAutorizacion extends Error {
  readonly estado: number;

  constructor(estado: number, mensaje: string) {
    super(mensaje);
    this.name = "ErrorDeAutorizacion";
    this.estado = estado;
  }
}
