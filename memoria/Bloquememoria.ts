export class bloqueMemoria {
    constructor(
        private readonly inicio: number,
        private  tamanio: number,
        private  pidProceso: number | null = null
    ) {}
    public estaLibre(): boolean {
        return this.pidProceso === null;
    }
    public cambiarTamanio(nuevoTamanio: number): void {
    this.tamanio = nuevoTamanio;
    }
     public puedeAlojar(tamanio: number): boolean {
    return this.estaLibre() && this.tamanio >= tamanio;
    }
    public asignar(pid: number): void {
        this.pidProceso = pid; 
    }
    public liberar(): void {
        this.pidProceso = null;
    }   
    public getInicio(): number {
        return this.inicio;
    }
    public getTamanio(): number {
        return this.tamanio;
    }
    public getPidProceso(): number | null {
        return this.pidProceso;
    } 


}
