import { EventoES } from "./EventoES.js";
import { estadoProceso } from "./EstadoProceso.js";

export class Proceso {
    private cpuRestante: number;
    private estado: estadoProceso = estadoProceso.Nuevo;
    private quantumConsumido: number = 0;
    private ticksCpuConsumidos: number = 0;
    private tiempoBloqueoRestante: number = 0;

    constructor(
        private readonly pid: number,
        private readonly memoriaRequerida: number,
        private readonly cpuTotal: number,
        private readonly eventoES: EventoES | null = null
    ) {
        Proceso.validarEnteroPositivo(pid, "El PID debe ser positivo");
        Proceso.validarEnteroPositivo(
            memoriaRequerida,
            "La memoria requerida debe ser positiva"
        );
        Proceso.validarEnteroPositivo(
            cpuTotal,
            "El tiempo total de CPU debe ser positivo"
        );

        this.cpuRestante = cpuTotal;
    }

    esperarMemoria(): void {
        this.validarEstado(estadoProceso.Nuevo);
        this.estado = estadoProceso.EsperandoMemoria;
    }

    admitir(): void {
        this.validarEstado(
            estadoProceso.Nuevo,
            estadoProceso.EsperandoMemoria
        );
        this.estado = estadoProceso.Listo;
    }

    despachar(): void {
        this.validarEstado(estadoProceso.Listo);
        this.estado = estadoProceso.Ejecutando;
        this.quantumConsumido = 0;
    }

    ejecutarTick(): estadoProceso {
        this.validarEstado(estadoProceso.Ejecutando);

        this.cpuRestante--;
        this.ticksCpuConsumidos++;
        this.quantumConsumido++;

        switch (this.cpuRestante === 0) {
            case true:
                this.estado = estadoProceso.Terminado;
                return this.estado;
        }

        const duracion =
            this.eventoES?.intentarDisparar(this.ticksCpuConsumidos) ?? null;

        switch (duracion) {
            case null:
                return this.estado;

            default:
                this.tiempoBloqueoRestante = duracion;
                this.estado = estadoProceso.Bloqueado;
                return this.estado;
        }
    }

    actualizarBloqueo(): boolean {
        this.validarEstado(estadoProceso.Bloqueado);
        this.tiempoBloqueoRestante--;

        switch (this.tiempoBloqueoRestante === 0) {
            case true:
                this.estado = estadoProceso.Listo;
                return true;

            default:
                return false;
        }
    }

    agotoQuantum(quantum: number): boolean {
        Proceso.validarEnteroPositivo(
            quantum,
            "El quantum debe ser positivo"
        );

        return this.quantumConsumido >= quantum;
    }

    enviarAListos(): void {
        this.validarEstado(estadoProceso.Ejecutando);
        this.estado = estadoProceso.Listo;
    }

    renovarQuantum(): void {
        this.validarEstado(estadoProceso.Ejecutando);
        this.quantumConsumido = 0;
    }

    getPid(): number {
        return this.pid;
    }

    getEstado(): estadoProceso {
        return this.estado;
    }

    getMemoriaRequerida(): number {
        return this.memoriaRequerida;
    }

    getCpuRestante(): number {
        return this.cpuRestante;
    }

    getQuantumConsumido(): number {
        return this.quantumConsumido;
    }

    getTiempoBloqueoRestante(): number {
        return this.tiempoBloqueoRestante;
    }

    private validarEstado(...permitidos: estadoProceso[]): void {
        switch (permitidos.includes(this.estado)) {
            case false:
                throw new Error(
                    `Transicion invalida desde el estado ${this.estado}`
                );
        }
    }

    private static validarEnteroPositivo(
        valor: number,
        mensaje: string
    ): void {
        switch (Number.isInteger(valor) && valor > 0) {
            case false:
                throw new Error(mensaje);
        }
    }
}
