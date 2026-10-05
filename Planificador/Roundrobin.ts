import { Proceso } from "../proceso/Proceso.js";
import { estadoProceso } from "../proceso/EstadoProceso.js";
import { ResultadoCPU } from "./ResultadoCpu.js";

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

        this.procesoActual?.despachar();
    }

    public ejecutarTick(): ResultadoCPU {

        this.procesoActual ?? this.despachar();

        return this.procesoActual
            ? this.ejecutarProceso(this.procesoActual)
            : ResultadoCPU.SIN_PROCESO;
    }

    private ejecutarProceso(
        proceso: Proceso
    ): ResultadoCPU {

        const estado = proceso.ejecutarTick();

        return estado === estadoProceso.Terminado
            ? this.procesoTerminado()

            : estado === estadoProceso.Bloqueado
            ? this.procesoBloqueado()

            : proceso.agotoQuantum(this.quantum)
            ? this.resolverQuantum(proceso)

            : ResultadoCPU.CONTINUA;
    }

    private procesoTerminado(): ResultadoCPU {
        this.procesoActual = null;

        return ResultadoCPU.TERMINADO;
    }

    private procesoBloqueado(): ResultadoCPU {
        this.procesoActual = null;

        return ResultadoCPU.BLOQUEADO;
    }

    private resolverQuantum(
        proceso: Proceso
    ): ResultadoCPU {

        return this.hayListos()
            ? this.rotarProceso(proceso)
            : this.renovarQuantum(proceso);
    }

    private rotarProceso(
        proceso: Proceso
    ): ResultadoCPU {

        proceso.enviarAListos();

        this.colaListos.push(proceso);

        this.procesoActual = null;

        return ResultadoCPU.ROTADO;
    }

    private renovarQuantum(
        proceso: Proceso
    ): ResultadoCPU {

        proceso.renovarQuantum();

        return ResultadoCPU.CONTINUA;
    }

    public hayListos(): boolean {
        return this.colaListos.length > 0;
    }

    public getProcesoActual(): Proceso | null {
        return this.procesoActual;
    }

    public getColaListos(): Proceso[] {
        return [...this.colaListos];
    }

    public cpuLibre(): boolean {
        return this.procesoActual === null;
    }

    public getQuantum(): number {
        return this.quantum;
    }
}