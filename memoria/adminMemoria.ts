import { bloqueMemoria } from "./Bloquememoria.js";

export class GestorMemoria {

    private bloques: bloqueMemoria[];

    constructor(
        private readonly memoriaTotal: number
    ) {
        this.bloques = [
            new bloqueMemoria(0, memoriaTotal)
        ];
    }

    public getBloques(): bloqueMemoria[] {
        return [...this.bloques];
    }

    public asignar(pid: number, tamanio: number): boolean {

        const bloqueLibre = this.bloques.find(
            bloque => bloque.puedeAlojar(tamanio)
        );

        return bloqueLibre
            ? this.ocuparBloque(bloqueLibre, pid, tamanio)
            : false;
    }

    private ocuparBloque(
        bloqueLibre: bloqueMemoria,
        pid: number,
        tamanio: number
    ): boolean {

        return bloqueLibre.getTamanio() === tamanio
            ? this.asignacionExacta(bloqueLibre, pid)
            : this.dividirBloque(bloqueLibre, pid, tamanio);
    }

    private asignacionExacta(
        bloqueLibre: bloqueMemoria,
        pid: number
    ): boolean {

        bloqueLibre.asignar(pid);

        return true;
    }

    private dividirBloque(
        bloqueLibre: bloqueMemoria,
        pid: number,
        tamanio: number
    ): boolean {

        const tamanioOriginal = bloqueLibre.getTamanio();

        const indice = this.bloques.indexOf(bloqueLibre);

        bloqueLibre.cambiarTamanio(tamanio);
        bloqueLibre.asignar(pid);

        const nuevoBloqueLibre = new bloqueMemoria(
            bloqueLibre.getInicio() + tamanio,
            tamanioOriginal - tamanio
        );

        this.bloques.splice(
            indice + 1,
            0,
            nuevoBloqueLibre
        );

        return true;
    }

    public liberar(pid: number): void {

        const bloque = this.bloques.find(
            bloque => bloque.getPidProceso() === pid
        );

        bloque?.liberar();

        bloque && this.coalescer();
    }

    private coalescer(): void {

        const bloquesFusionados: bloqueMemoria[] = [];

        this.bloques.forEach(bloque => {

            const ultimo =
                bloquesFusionados[bloquesFusionados.length - 1];

            ultimo !== undefined &&
            ultimo.estaLibre() &&
            bloque.estaLibre()
                ? ultimo.cambiarTamanio(
                    ultimo.getTamanio() +
                    bloque.getTamanio()
                )
                : bloquesFusionados.push(bloque);
        });

        this.bloques = bloquesFusionados;
    }

    public getMemoriaLibre(): number {

        return this.bloques
            .filter(bloque => bloque.estaLibre())
            .reduce(
                (total, bloque) =>
                    total + bloque.getTamanio(),
                0
            );
    }

    public getMayorBloqueLibre(): number {

        const tamanios = this.bloques
            .filter(bloque => bloque.estaLibre())
            .map(bloque => bloque.getTamanio());

        return Math.max(0, ...tamanios);
    }
}