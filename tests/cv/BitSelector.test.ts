import { BitString } from "../../src/BitString";
import { Circuit } from "../../src/Circuit";
import { BitSelector } from "../../src/CircuitElement/BitSelector";
import { loadProject } from "../../src/CircuitLoader";
import { CircuitVerseLoader } from "../../src/CircuitLoader/CircuitVerseLoader";

let bitSelector: Circuit;

beforeAll(async () => {
    const project = await loadProject(CircuitVerseLoader, 'tests/cv/BitSelector.cv');
    bitSelector = project.getCircuitByName('BitSelector');
});

test("Should return 1", () => {
    const inputs = {
        Input: "1000",
        Selector: "11"
    };

    const results = bitSelector.run(inputs);

    expect(results.outputs.Output.toString()).toStrictEqual("1");
})

test("Should return 1", () => {
    const inputs = {
        Input: "0001",
        Selector: "00"
    };

    const results = bitSelector.run(inputs);

    expect(results.outputs.Output.toString()).toStrictEqual("1");
})

test("Should return 0", () => {
    const inputs = {
        Input: "0001",
        Selector: "10"
    };

    const results = bitSelector.run(inputs);

    expect(results.outputs.Output.toString()).toStrictEqual("0");
})

test("Should not equal 1", () => {
    const inputs = {
        Input: "0001",
        Selector: "01"
    };

    const results = bitSelector.run(inputs);

    expect(results.outputs.Output.toString()).not.toStrictEqual("1");
})

test("Should equal 0", () => {
    const inputs = {
        Input: "1011",
        Selector: "10"
    };

    const results = bitSelector.run(inputs);

    expect(results.outputs.Output.toString()).toStrictEqual("0");
})