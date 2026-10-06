import { describe, test, expect } from "vitest";
import { Simulador } from "../Simulador/Simulador.js";
import { Proceso } from "../proceso/Proceso.js";

describe("Simulador", () => {

    test("debe comenzar en tick 0", () => {

        const simulador =
            new Simulador(1024, 2);

        expect(simulador.getTickActual())
            .toBe(0);
    });


    test("cada llamada debe avanzar exactamente un tick", () => {

        const simulador =
            new Simulador(1024, 2);

        simulador.avanzarTick();

        expect(simulador.getTickActual())
            .toBe(1);

        simulador.avanzarTick();

        expect(simulador.getTickActual())
            .toBe(2);
    });


    test("un proceso debe terminar y liberar CPU", () => {

        const simulador =
            new Simulador(1024, 2);

        const p1 =
            new Proceso(1, 300, 1);

        simulador.registrarProceso(p1);

        simulador.avanzarTick();

        expect(
            simulador.getTerminados().length
        ).toBe(1);

        expect(
            simulador.getTerminados()[0]?.getPid()
        ).toBe(1);
    });
    test("debe rechazar PID duplicado", () => {

     const simulador = new Simulador(1024, 2);

     simulador.registrarProceso(
        new Proceso(1, 100, 2)
     );

     expect(() =>
        simulador.registrarProceso(
            new Proceso(1, 200, 3)
        )
     ).toThrow();
    });
    test("debe rechazar un proceso mayor a la memoria total", () => {

     const simulador = new Simulador(1024, 2);

     expect(() =>
        simulador.registrarProceso(
            new Proceso(1, 2000, 3)
        )
     ).toThrow();
    });
    test("debe admitir un proceso esperando cuando se libera memoria", () => {
       const simulador =
          new Simulador(300, 2);

       const p1 =
          new Proceso(1, 300, 1);   

       const p2 =
         new Proceso(2, 300, 1);

        simulador.registrarProceso(p1);
        simulador.registrarProceso(p2);

        simulador.avanzarTick();

        expect(simulador.getEsperandoMemoria().length)
          .toBe(1);

        expect(simulador.getTerminados().length)
           .toBe(1);

       simulador.avanzarTick();

       expect(simulador.getEsperandoMemoria().length)
          .toBe(0);

       expect(simulador.getTerminados().length)
          .toBe(2);
    });
});