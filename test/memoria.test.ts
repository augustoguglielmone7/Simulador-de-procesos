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


    test("debe asignar memoria a un proceso", () => {

        const memoria = new GestorMemoria(1024);

        const resultado =
            memoria.asignar(1, 300);

        expect(resultado).toBe(true);

        expect(memoria.getMemoriaLibre())
            .toBe(724);
    });


    test("debe dividir un bloque cuando sobra memoria", () => {

        const memoria = new GestorMemoria(1024);

        memoria.asignar(1, 300);

        const bloques = memoria.getBloques();

        expect(bloques.length).toBe(2);

        expect(bloques[0]?.getTamanio())
            .toBe(300);

        expect(bloques[1]?.getTamanio())
            .toBe(724);
    });


    test("no debe crear bloque de tamaño cero", () => {

        const memoria = new GestorMemoria(300);

        memoria.asignar(1, 300);

        expect(memoria.getBloques().length)
            .toBe(1);
    });


    test("debe liberar memoria", () => {

        const memoria = new GestorMemoria(1024);

        memoria.asignar(1, 300);
        memoria.liberar(1);

        expect(memoria.getMemoriaLibre())
            .toBe(1024);
    });


    test("debe hacer coalescencia", () => {

        const memoria = new GestorMemoria(1000);

        memoria.asignar(1, 300);
        memoria.asignar(2, 300);

        memoria.liberar(2);
        memoria.liberar(1);

        expect(memoria.getBloques().length)
            .toBe(1);

        expect(memoria.getBloques()[0]?.getTamanio())
            .toBe(1000);
    });
    test("debe fallar si no existe bloque suficientemente grande", () => {
      const memoria =
         new GestorMemoria(500);

       memoria.asignar(1, 300);

       const resultado =
          memoria.asignar(2, 250);

       expect(resultado).toBe(false);

       expect(memoria.getMemoriaLibre())
         .toBe(200);
    });
    test("debe devolver el mayor bloque libre", () => {
       const memoria =
          new GestorMemoria(1000);

       memoria.asignar(1, 100);
       memoria.asignar(2, 200);

       memoria.liberar(1);

       expect(memoria.getMayorBloqueLibre())
          .toBe(700);
    });

});

   