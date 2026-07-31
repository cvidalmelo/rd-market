/** Error de negocio cuyo mensaje se puede mostrar directamente al usuario. */
export class ErrorDeValidacion extends Error {
  constructor(mensaje: string) {
    super(mensaje);
    this.name = "ErrorDeValidacion";
  }
}
