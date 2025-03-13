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

    const outputs = {
        OutputA: new BitString("0000"),
        OutputB: new BitString("1", 1)
    };

    const results = lsb.run(inputs);

    expect(results.outputs).toStrictEqual(outputs);
});

test("Index 1 Output", () => {
    const inputs = {
        InputA: new BitString("0010", 4),
    };

    const outputs = {
        OutputA: new BitString("0001", 4),
        OutputB: new BitString("1", 1)
    };

    const results = lsb.run(inputs);

    expect(results.outputs).toStrictEqual(outputs);
});

test("Index 2 Output", () => {
    const inputs = {
        InputA: new BitString("0100", 4),
    };

    const outputs = {
        OutputA: new BitString("0010", 4),
        OutputB: new BitString("1", 1)
    };

    const results = lsb.run(inputs);

    expect(results.outputs).toStrictEqual(outputs);
});

test("Index 3 Output", () => {
    const inputs = {
        InputA: new BitString("1000", 4),
    };

    const outputs = {
        OutputA: new BitString("0011"),
        OutputB: new BitString("1", 1)
    };

    const results = lsb.run(inputs);

    expect(results.outputs).toStrictEqual(outputs);
});


test("No Input", () => {
    const inputs = {
        InputA: new BitString("0000", 4)
    };

    const outputs = {
        OutputA: new BitString("0000", 4),
        OutputB: new BitString("0", 1)
    };

    const results = lsb.run(inputs);

    expect(results.outputs).toStrictEqual(outputs);
})