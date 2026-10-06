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

});