import { describe, test, expect } from "vitest";
import { Proceso } from "../proceso/Proceso.js";
import { estadoProceso } from "../proceso/EstadoProceso.js";

describe("Proceso", () => {

    test("debe comenzar en estado Nuevo", () => {

        const proceso = new Proceso(1, 200, 5);

        expect(proceso.getEstado())
            .toBe(estadoProceso.Nuevo);

        expect(proceso.getCpuRestante())
            .toBe(5);

        expect(proceso.getQuantumConsumido())
            .toBe(0);
    });


    test("debe pasar a EsperandoMemoria", () => {

        const proceso = new Proceso(1, 200, 5);

        proceso.esperarMemoria();

        expect(proceso.getEstado())
            .toBe(estadoProceso.EsperandoMemoria);
    });


    test("debe pasar a Listo al ser admitido", () => {

        const proceso = new Proceso(1, 200, 5);

        proceso.esperarMemoria();
        proceso.admitir();

        expect(proceso.getEstado())
            .toBe(estadoProceso.Listo);
    });


    test("debe pasar a Ejecutando al despacharse", () => {

        const proceso = new Proceso(1, 200, 5);

        proceso.esperarMemoria();
        proceso.admitir();
        proceso.despachar();

        expect(proceso.getEstado())
            .toBe(estadoProceso.Ejecutando);
    });


 