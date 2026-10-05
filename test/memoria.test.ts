import { describe, test, expect } from "vitest";
import { GestorMemoria } from "../memoria/adminMemoria.js";

describe("GestorMemoria", () => {

    test("debe comenzar con toda la memoria libre", () => {

        const memoria = new GestorMemoria(1024);

        expect(memoria.getMemoriaLibre())
            .toBe(1024);

        expect(memoria.getBloques().length)
            .toBe(1);
    });



   