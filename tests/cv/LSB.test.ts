import { BitString } from "../../src/BitString";
import { Circuit } from "../../src/Circuit";
import { loadProject } from "../../src/CircuitLoader";
import { CircuitVerseLoader } from "../../src/CircuitLoader/CircuitVerseLoader";

let lsb: Circuit;

beforeAll(async () => {
    const project = await loadProject(CircuitVerseLoader, 'tests/cv/LSB.cv');
    lsb = project.getCircuitByName('LSB');
});

test("High Input", () => {
    const inputs = {
        InputA: new BitString("1"),
    };

    const outputs = {
        OutputA: new BitString("0"),
        OutputB: new BitString("1")
    };

    const results = lsb.run(inputs);

    expect(results).toStrictEqual(outputs)
})