import { loadProject } from "../src/CircuitLoader";
import { CircuitVerseLoader } from "../src/CircuitLoader/CircuitVerseLoader";
import { BitString } from "../src/BitString";

test('Multiple inputs with the same label', async () => {
    expect(async () => {
        await loadProject(CircuitVerseLoader, 'tests/cv/DuplicateInputLabels.cv')
    }).rejects.toThrow('Multiple inputs with the same label');
});

test('Multiple inputs with the same label', async () => {
    expect(async () => {
        await loadProject(CircuitVerseLoader, 'tests/cv/DuplicateOutputLabels.cv')
    }).rejects.toThrow('Multiple outputs with the same label');
});

test('Bad inputs and outputs', async() => {
    const project = await loadProject(CircuitVerseLoader, 'tests/cv/Simple.cv');
    const circuit = project.getCircuitByName('Combinatorial');

    expect(() => circuit.run({randomInput: null})).toThrow('No inputs or outputs with the given label');
});

test('Infinite loop', async() => {
    const project = await loadProject(CircuitVerseLoader, 'tests/cv/InfiniteLoop.cv');
    const circuit = project.getCircuitByName('Main');

    expect(() => circuit.run({'inp1': '1'})).toThrow('Simulation step limit exceeded');
});
