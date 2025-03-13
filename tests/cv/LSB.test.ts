import { BitString } from "../../src/BitString";
import { Circuit } from "../../src/Circuit";
import { loadProject } from "../../src/CircuitLoader";
import { CircuitVerseLoader } from "../../src/CircuitLoader/CircuitVerseLoader";

let lsb: Circuit;

beforeAll(async () => {
    const project = await loadProject(CircuitVerseLoader, 'tests/cv/LSB.cv');
    lsb = project.getCircuitByName('LSB');
});

test("Index 0 Output", () => {
    const inputs = {
        InputA: new BitString("0001", 4),
    };

    const results = lsb.run(inputs);

    expect(results.outputs.OutputA.equals("0000")).toBe(true);
    expect(results.outputs.OutputB.equals("1")).toBe(true);
});

test("Index 1 Output", () => {
    const inputs = {
        InputA: new BitString("0010", 4),
    };

    const results = lsb.run(inputs);

    expect(results.outputs.OutputA.equals("0001")).toBe(true);
    expect(results.outputs.OutputB.equals("1")).toBe(true);
});

test("Index 2 Output", () => {
    const inputs = {
        InputA: new BitString("0100", 4),
    };

    const results = lsb.run(inputs);

    expect(results.outputs.OutputA.equals("0010")).toBe(true);
    expect(results.outputs.OutputB.equals("1")).toBe(true);
});

test("Index 3 Output", () => {
    const inputs = {
        InputA: new BitString("1000", 4),
    };

    const results = lsb.run(inputs);

    expect(results.outputs.OutputA.equals("0011")).toBe(true);
    expect(results.outputs.OutputB.equals("1")).toBe(true);
});


test("No Input", () => {
    const inputs = {
        InputA: new BitString("0000", 4)
    };

    const results = lsb.run(inputs);

    expect(results.outputs.OutputA.equals("0000")).toBe(true);
    expect(results.outputs.OutputB.equals("0")).toBe(true);
})