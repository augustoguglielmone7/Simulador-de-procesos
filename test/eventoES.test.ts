import { describe, test, expect } from "vitest";
import { EventoES } from "../proceso/EventoES.js";

describe("EventoES", () => {

    test("no debe dispararse antes del tick configurado", () => {

        const evento = new EventoES(3, 2);

        const resultado = evento.intentarDisparar(2);

        expect(resultado).toBeNull();
    });


    test("debe dispararse al alcanzar el tick configurado", () => {

        const evento = new EventoES(3, 2);

        const resultado = evento.intentarDisparar(3);

        expect(resultado).toBe(2);
    });


    test("no debe dispararse nuevamente", () => {

        const evento = new EventoES(3, 2);

        evento.intentarDisparar(3);

        const segundoIntento =
            evento.intentarDisparar(3);

        expect(segundoIntento).toBeNull();
    });
      test("debe rechazar un disparo inválido", () => {
         expect(() => new EventoES(0, 2)).toThrow();
    });

      test("debe rechazar una duración inválida", () => {
        expect(() => new EventoES(3, 0)).toThrow();
    });

});