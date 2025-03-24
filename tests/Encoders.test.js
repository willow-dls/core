import { BitString } from "../../src/BitString";
import { loadProject } from "../../src/CircuitLoader";
import { CircuitVerseLoader } from "../../src/CircuitLoader/CircuitVerseLoader";




let circuit;

beforeAll(async () => {
    const project = await loadProject(CircuitVerseLoader, 'tests/cv/Encoders.cv');
    circuit_Encoder = project.getCircuitByName('Encoder');
    circuit_Decoder = project.getCircuitByName('Decoder');

});


const table1 = [
    ['0', '0', '0', '0'],
    ['0', '0', '0', '1'],
    ['0', '0', '1', '0']
    ['0', '0', '1', '1'],
    ['0', '1', '0', '0'],
    ['0', '1', '0', '1'],
    ['0', '1', '1', '0'],
    ['0', '1', '1', '1'],
    ['1', '0', '0', '0'],
    ['1', '0', '0', '1'],
    ['1', '0', '1', '0'],
    ['1', '0', '1', '1'],
    ['1', '1', '0', '0'],
    ['1', '1', '0', '1'],
    ['1', '1', '1', '0'],
    ['1', '1', '1', '1'],
];

const table2 = [
    ['0', '0'],
    ['0', '1'],
    ['1', '0'],
    ['1', '1'],
]

for (const entry of table) {
    const inputs = {
        Input: new BitString(entry[0]),
        Enable: new BitString(entry[1]),
    };

    const outputs = {
        Output: entry[2] != null ? new BitString(entry[2]) : null,
    };

    test(`[Input = ${inputs.Input}, Enable = ${inputs.Enable}] => [Output = ${outputs.Output}]`, () => {
        const results = circuit.run(inputs);
        expect(results.outputs).toStrictEqual(outputs);
    });
}
