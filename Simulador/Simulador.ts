import { Proceso } from "../proceso/Proceso.js";
import { estadoProceso } from "../proceso/EstadoProceso.js";
import { GestorMemoria } from "../memoria/adminMemoria.js";
import { PlanificadorRoundRobin } from "../Planificador/Roundrobin.js";
import { ResultadoCPU } from "../Planificador/ResultadoCpu.js";

export class Simulador {

    private tickActual: number = 0;
    private procesos: Map<number, Proceso> = new Map();

    private esperandoMemoria: Proceso[] = [];
    private bloqueados: Proceso[] = [];
    private terminados: Proceso[] = [];

    private memoria: GestorMemoria;
    private planificador: PlanificadorRoundRobin;

    constructor(
        private readonly memoriaTotal: number,
        quantum: number
    ) {
        this.memoria = new GestorMemoria(memoriaTotal);
        this.planificador = new PlanificadorRoundRobin(quantum);
    }

    public registrarProceso(proceso: Proceso): void {

        switch (this.procesos.has(proceso.getPid())) {
            case true:
                throw new Error("PID repetido");
        }

        switch (proceso.getMemoriaRequerida() > this.memoriaTotal) {
            case true:
                throw new Error("El proceso supera la memoria total");
        }

        this.procesos.set(proceso.getPid(), proceso);
        this.esperandoMemoria.push(proceso);
    }

    public avanzarTick(): void {

        this.admitirProcesos();
        this.actualizarBloqueados();
        this.ejecutarCPU();

        this.tickActual++;
    }

    private admitirProcesos(): void {

        this.esperandoMemoria =
            this.esperandoMemoria.filter(proceso => {

                const asignado = this.memoria.asignar(
                    proceso.getPid(),
                    proceso.getMemoriaRequerida()
                );

                return asignado
                    ? this.pasarAListo(proceso)
                    : this.seguirEsperando(proceso);
            });
    }
    private pasarAListo(proceso: Proceso): boolean {

        proceso.admitir();
        this.planificador.agregarListo(proceso);

        return false;
    }

    private seguirEsperando(proceso: Proceso): boolean {

        switch (proceso.getEstado()) {
            case estadoProceso.Nuevo:
                proceso.esperarMemoria();
        }

        return true;
    }

    private actualizarBloqueados(): void {

        this.bloqueados =
            this.bloqueados.filter(proceso => {

                const desbloqueado =
                    proceso.actualizarBloqueo();

                desbloqueado &&
                    this.planificador.agregarListo(proceso);

                return !desbloqueado;
            });
    }

    private ejecutarCPU(): void {

        const proceso =
            this.planificador.getProcesoActual()
            ?? this.planificador.getColaListos()[0]
            ?? null;

        const resultado =
            this.planificador.ejecutarTick();

        switch (resultado) {

            case ResultadoCPU.TERMINADO:
                proceso && this.terminarProceso(proceso);
                break;

            case ResultadoCPU.BLOQUEADO:
                proceso && this.bloqueados.push(proceso);
                break;
        }
    }

    private terminarProceso(proceso: Proceso): void {

        this.memoria.liberar(proceso.getPid());
        this.terminados.push(proceso);
    }

    public getTickActual(): number {
        return this.tickActual;
    }

    public getListos(): Proceso[] {
        return this.planificador.getColaListos();
    }

    public getBloqueados(): Proceso[] {
        return [...this.bloqueados];
    }

    public getEsperandoMemoria(): Proceso[] {
        return [...this.esperandoMemoria];
    }

    public getTerminados(): Proceso[] {
        return [...this.terminados];
    }

    public getProcesoCPU(): Proceso | null {
        return this.planificador.getProcesoActual();
    }
}
