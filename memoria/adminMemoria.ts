import { BloqueMemoria } from "./BloqueMemoria.js";

export class GestorMemoria {

  private bloques: BloqueMemoria[];

  constructor(
    private readonly memoriaTotal: number
  ) {
    this.bloques = [
      new BloqueMemoria(0, memoriaTotal)
    ];
  }

  public asignar(
    pid: number,
    tamanio: number
  ): boolean {

    const indice = this.bloques.findIndex(
      bloque => bloque.puedeAlojar(tamanio)
    );

    if (indice === -1) {
      return false;
    }

    const bloqueLibre = this.bloques[indice];

    if (bloqueLibre.getTamanio() === tamanio) {
      bloqueLibre.asignar(pid);
      return true;
    }

    const tamanioOriginal =
      bloqueLibre.getTamanio();

    bloqueLibre.cambiarTamanio(tamanio);
    bloqueLibre.asignar(pid);

    const nuevoBloqueLibre =
      new BloqueMemoria(
        bloqueLibre.getInicio() + tamanio,
        tamanioOriginal - tamanio
      );

   