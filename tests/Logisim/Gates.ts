import { expect, beforeAll, test } from "@jest/globals";

import { loadProject } from "../../src/CircuitLoader";
import { LogisimLoader } from "../../src/CircuitLoader/LogisimLoader";

// let logger = new FileLogger('simple.log');
let project;


test("Load Logisim file by name", async () => {
    const project = await loadProject(LogisimLoader, "tests/Logisim/Gates_Simple.circ");
    expect(project).not.toBe(null);
});

// beforeAll(async () => {
//     // logger.setLevel(LogLevel.TRACE).setSubsystems(/^Circuit$/);
//     project = await loadProject(LogisimLoader, "tests/Logisim/Gates_Simple.circ");
// });

// test("And Gate-1", async () => {
//     const circuit = project.getCircuitByName("And Gate");

//     const output = circuit.run({
//         Input1: "0",
//         Input2: "0",
//     });

//     expect(output.outputs.out1.toString()).toBe("0");
// });

// test("And Gate-2", async () => {
//     const circuit = project.getCircuitByName("And Gate");

//     const output = circuit.run({
//         Input1: "1",
//         Input2: "0",
//     });

//     expect(output.outputs.out1.toString()).toBe("0");
// });

// test("And Gate-3", async () => {
//     const circuit = project.getCircuitByName("And Gate");

//     const output = circuit.run({
//         Input1: "0",
//         Input2: "1",
//     });

//     expect(output.outputs.out1.toString()).toBe("0");
// });

// test("And Gate-4", async () => {
//     const circuit = project.getCircuitByName("And Gate");

//     const output = circuit.run({
//         Input1: "1",
//         Input2: "1",
//     });

//     expect(output.outputs.out1.toString()).toBe("1");
// });


// test("And Gate2-1", async () => {
//     const circuit = project.getCircuitByName("And Gate 2");

//     const output = circuit.run({
//         Input1: "0",
//         Input2: "0",
//     });

//     expect(output.outputs.out1.toString()).toBe("0");
// });

// test("And Gate2-2", async () => {
//     const circuit = project.getCircuitByName("And Gate 2");

//     const output = circuit.run({
//         Input1: "1",
//         Input2: "0",
//     });

//     expect(output.outputs.out1.toString()).toBe("0");
// });

// test("And Gate2-3", async () => {
//     const circuit = project.getCircuitByName("And Gate 2");

//     const output = circuit.run({
//         Input1: "0",
//         Input2: "1",
//     });

//     expect(output.outputs.out1.toString()).toBe("0");
// });

// test("And Gate2-4", async () => {
//     const circuit = project.getCircuitByName("And Gate 2");

//     const output = circuit.run({
//         Input1: "1",
//         Input2: "1",
//     });

//     expect(output.outputs.out1.toString()).toBe("1");
// });

// test("OR Gate-1", async () => {
//     const circuit = project.getCircuitByName("OR Gate");

//     const output = circuit.run({
//         Input1: "0",
//         Input2: "0",
//     });

//     expect(output.outputs.out1.toString()).toBe("0");
// });

// test("OR Gate-2", async () => {
//     const circuit = project.getCircuitByName("OR Gate");

//     const output = circuit.run({
//         Input1: "1",
//         Input2: "0",
//     });

//     expect(output.outputs.out1.toString()).toBe("1");
// });

// test("OR Gate-3", async () => {
//     const circuit = project.getCircuitByName("OR Gate");

//     const output = circuit.run({
//         Input1: "0",
//         Input2: "1",
//     });

//     expect(output.outputs.out1.toString()).toBe("1");
// });

// test("OR Gate-4", async () => {
//     const circuit = project.getCircuitByName("OR Gate");

//     const output = circuit.run({
//         Input1: "1",
//         Input2: "1",
//     });

//     expect(output.outputs.out1.toString()).toBe("1");
// });


// test("NAND Gate-1", async () => {
//     const circuit = project.getCircuitByName("NAND Gate");

//     const output = circuit.run({
//         Input1: "0",
//         Input2: "0",
//     });

//     expect(output.outputs.out1.toString()).toBe("1");
// });

// test("NAND Gate-2", async () => {
//     const circuit = project.getCircuitByName("NAND Gate");

//     const output = circuit.run({
//         Input1: "1",
//         Input2: "0",
//     });

//     expect(output.outputs.out1.toString()).toBe("1");
// });

// test("NAND Gate-3", async () => {
//     const circuit = project.getCircuitByName("NAND Gate");

//     const output = circuit.run({
//         Input1: "0",
//         Input2: "1",
//     });

//     expect(output.outputs.out1.toString()).toBe("1");
// });

// test("NAND Gate-4", async () => {
//     const circuit = project.getCircuitByName("NAND Gate");

//     const output = circuit.run({
//         Input1: "1",
//         Input2: "1",
//     });

//     expect(output.outputs.out1.toString()).toBe("0");
// });


// test("NOR Gate-1", async () => {
//     const circuit = project.getCircuitByName("NOR Gate");

//     const output = circuit.run({
//         Input1: "0",
//         Input2: "0",
//     });

//     expect(output.outputs.out1.toString()).toBe("1");
// });

// test("NOR Gate-2", async () => {
//     const circuit = project.getCircuitByName("NOR Gate");

//     const output = circuit.run({
//         Input1: "1",
//         Input2: "0",
//     });

//     expect(output.outputs.out1.toString()).toBe("0");
// });

// test("NOR Gate-3", async () => {
//     const circuit = project.getCircuitByName("NOR Gate");

//     const output = circuit.run({
//         Input1: "0",
//         Input2: "1",
//     });

//     expect(output.outputs.out1.toString()).toBe("0");
// });

// test("NOR Gate-4", async () => {
//     const circuit = project.getCircuitByName("NOR Gate");

//     const output = circuit.run({
//         Input1: "1",
//         Input2: "1",
//     });

//     expect(output.outputs.out1.toString()).toBe("0");
// });


// test("NOT Gate-1", async () => {
//     const circuit = project.getCircuitByName("NOT Gate");

//     const output = circuit.run({
//         Input1: "0",
//     });

//     expect(output.outputs.out1.toString()).toBe("1");
// });

// test("NOT Gate-2", async () => {
//     const circuit = project.getCircuitByName("NOT Gate");

//     const output = circuit.run({
//         Input1: "1",
//     });

//     expect(output.outputs.out1.toString()).toBe("0");
// });


// test("Buffer Gate-1", async () => {
//     const circuit = project.getCircuitByName("Buffer Gate");

//     const output = circuit.run({
//         Input1: "0",
//     });

//     expect(output.outputs.out1.toString()).toBe("0");
// });

// test("Buffer Gate-2", async () => {
//     const circuit = project.getCircuitByName("Buffer Gate");

//     const output = circuit.run({
//         Input1: "1",
//     });

//     expect(output.outputs.out1.toString()).toBe("1");
// });


// test("XOR Gate-1", async () => {
//     const circuit = project.getCircuitByName("XOR Gate");

//     const output = circuit.run({
//         Input1: "0",
//         Input2: "0",
//     });

//     expect(output.outputs.out1.toString()).toBe("0");
// });

// test("XOR Gate-2", async () => {
//     const circuit = project.getCircuitByName("XOR Gate");

//     const output = circuit.run({
//         Input1: "1",
//         Input2: "0",
//     });

//     expect(output.outputs.out1.toString()).toBe("1");
// });

// test("XOR Gate-3", async () => {
//     const circuit = project.getCircuitByName("XOR Gate");

//     const output = circuit.run({
//         Input1: "0",
//         Input2: "1",
//     });

//     expect(output.outputs.out1.toString()).toBe("1");
// });

// test("XOR Gate-4", async () => {
//     const circuit = project.getCircuitByName("XOR Gate");

//     const output = circuit.run({
//         Input1: "1",
//         Input2: "1",
//     });

//     expect(output.outputs.out1.toString()).toBe("0");
// });


// test("XNOR Gate-1", async () => {
//     const circuit = project.getCircuitByName("XNOR Gate");

//     const output = circuit.run({
//         Input1: "0",
//         Input2: "0",
//     });

//     expect(output.outputs.out1.toString()).toBe("1");
// });

// test("XNOR Gate-2", async () => {
//     const circuit = project.getCircuitByName("XNOR Gate");

//     const output = circuit.run({
//         Input1: "1",
//         Input2: "0",
//     });

//     expect(output.outputs.out1.toString()).toBe("0");
// });

// test("XNOR Gate-3", async () => {
//     const circuit = project.getCircuitByName("XNOR Gate");

//     const output = circuit.run({
//         Input1: "0",
//         Input2: "1",
//     });

//     expect(output.outputs.out1.toString()).toBe("0");
// });

// test("XNOR Gate-4", async () => {
//     const circuit = project.getCircuitByName("XNOR Gate");

//     const output = circuit.run({
//         Input1: "1",
//         Input2: "1",
//     });

//     expect(output.outputs.out1.toString()).toBe("1");
// });