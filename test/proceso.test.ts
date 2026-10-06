import { describe, test, expect } from "vitest";
import { Proceso } from "../proceso/Proceso.js";
import { estadoProceso } from "../proceso/EstadoProceso.js";
import { EventoES } from "../proceso/EventoES.js";

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


    test("debe consumir una unidad de CPU por tick", () => {

        const proceso = new Proceso(1, 200, 5);

        proceso.esperarMemoria();
        proceso.admitir();
        proceso.despachar();

        proceso.ejecutarTick();

        expect(proceso.getCpuRestante())
            .toBe(4);

        expect(proceso.getQuantumConsumido())
            .toBe(1);
    });


    test("debe terminar cuando CPU restante llega a cero", () => {

        const proceso = new Proceso(1, 200, 1);

        proceso.esperarMemoria();
        proceso.admitir();
        proceso.despachar();

        proceso.ejecutarTick();

        expect(proceso.getEstado())
            .toBe(estadoProceso.Terminado);

        expect(proceso.getCpuRestante())
            .toBe(0);
    });
    test("debe bloquearse por E/S", () => {

    const evento = new EventoES(1, 2);
    const proceso = new Proceso(1, 100, 5, evento);

    proceso.esperarMemoria();
    proceso.admitir();
    proceso.despachar();

    proceso.ejecutarTick();

    expect(proceso.getEstado())
        .toBe(estadoProceso.Bloqueado);
    });
    test("debe volver a listo después del bloqueo", () => {

    const evento = new EventoES(1, 2);
    const proceso = new Proceso(1, 100, 5, evento);

    proceso.esperarMemoria();
    proceso.admitir();
    proceso.despachar();

    proceso.ejecutarTick();

    proceso.actualizarBloqueo();
    proceso.actualizarBloqueo();

    expect(proceso.getEstado())
        .toBe(estadoProceso.Listo);
    });

});