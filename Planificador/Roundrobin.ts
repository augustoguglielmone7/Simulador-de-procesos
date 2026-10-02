import { Proceso } from "../proceso/Proceso.js";

export class PlanificadorRoundRobin {

    private colaListos: Proceso[] = [];
    private procesoActual: Proceso | null = null;

    constructor(
        private readonly quantum: number
    ) {}

    public agregarListo(proceso: Proceso): void {
        this.colaListos.push(proceso);
    }

    public despachar(): void {
        this.procesoActual =
            this.colaListos.shift() ?? null;

        this.procesoActual?.comenzarEjecucion();
    }

    public getProcesoActual(): Proceso | null {
        return this.procesoActual;
    }

    public hayListos(): boolean {
        return this.colaListos.length > 0;
    }

    public liberarCPU(): void {
        this.procesoActual = null;
    }

    public getColaListos(): Proceso[] {
        return [...this.colaListos];
    }

    public getQuantum(): number {
        return this.quantum;
    }
}