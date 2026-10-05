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

