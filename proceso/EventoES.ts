export class EventoES {
    private disparado: boolean = false;

    constructor(
        private readonly tickCpuDisparo: number,
        private readonly duracionBloqueo: number
    ) {
        EventoES.validarEnteroPositivo(
            tickCpuDisparo,
            "El tick de disparo debe ser un entero positivo"
        );
        EventoES.validarEnteroPositivo(
            duracionBloqueo,
            "La duracion del bloqueo debe ser un entero positivo"
        );
    }

    intentarDisparar(ticksCpuConsumidos: number): number | null {
        switch (this.disparado || ticksCpuConsumidos !== this.tickCpuDisparo) {
            case true:
                return null;
            default:
                this.disparado = true;
                return this.duracionBloqueo;
        }
    }

    getTickCpuDisparo(): number {
        return this.tickCpuDisparo;
    }

    getDuracionBloqueo(): number {
        return this.duracionBloqueo;
    }

    fueDisparado(): boolean {
        return this.disparado;
    }

    private static validarEnteroPositivo(valor: number, mensaje: string): void {
        switch (Number.isInteger(valor) && valor > 0) {
            case false:
                throw new Error(mensaje);
        }
    }
}
