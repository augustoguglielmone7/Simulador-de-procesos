import { describe, test, expect } from "vitest";
import { Proceso } from "../proceso/Proceso.js";
import { PlanificadorRoundRobin }
    from "../Planificador/Roundrobin.js";
import { ResultadoCPU } from "../Planificador/ResultadoCpu.js";

describe("Round Robin", () => {

    test("debe rotar procesos con quantum 2", () => {

        const planificador =
            new PlanificadorRoundRobin(2);

        const p1 = new Proceso(1, 100, 3);
        const p2 = new Proceso(2, 100, 2);

        p1.esperarMemoria();
        p1.admitir();

        p2.esperarMemoria();
        p2.admitir();

        planificador.agregarListo(p1);
        planificador.agregarListo(p2);

        planificador.ejecutarTick();
        planificador.ejecutarTick();

        expect(
            planificador.getColaListos()[0]?.getPid()
        ).toBe(2);

        planificador.ejecutarTick();
        planificador.ejecutarTick();

        expect(p2.getCpuRestante())
            .toBe(0);

        planificador.ejecutarTick();

        expect(p1.getCpuRestante())
            .toBe(0);
    });
     test("debe indicar SIN_PROCESO si la cola esta vacia", () => {
        const planificador =
        new PlanificadorRoundRobin(2);

        const resultado =
        planificador.ejecutarTick();

       expect(resultado)
        .toBe(ResultadoCPU.SIN_PROCESO);
    });
    test("debe renovar quantum si no hay otros procesos listos", () => {
        const planificador =
            new PlanificadorRoundRobin(2);

      const proceso =
           new Proceso(1, 100, 5);

       proceso.esperarMemoria();
       proceso.admitir();

       planificador.agregarListo(proceso);

       planificador.ejecutarTick();
       planificador.ejecutarTick();

       expect(planificador.getProcesoActual()?.getPid())
        .toBe(1);

      expect(proceso.getQuantumConsumido())
        .toBe(0);
   });

});