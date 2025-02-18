import {loadProject} from '../src/CircuitLoader';
import {CircuitVerseLoader} from '../src/CircuitLoader/CircuitVerseLoader';

let project;

beforeAll(async () => {
    project = await loadProject(CircuitVerseLoader, 'tests/cv/Simple.cv');
    expect(project).not.toBe(null);
    return project;
});

test('Simple Combinatorial 1', async() => {
    const circuit = project.getCircuitByName('Combinatorial');
    expect(circuit).not.toBe(null);

    const output = circuit.run({
        inp1: 0,
        inp2: 0
    });

    expect(output.outputs.out1).toBe(0);
});

test('Simple Combinatorial 2', async() => {
    const circuit = project.getCircuitByName('Combinatorial');
    expect(circuit).not.toBe(null);

    const output = circuit.run({
        inp1: 0,
        inp2: 1
    });

    expect(output.outputs.out1).toBe(0);
});

test('Simple Combinatorial 3', async() => {
    const circuit = project.getCircuitByName('Combinatorial');
    expect(circuit).not.toBe(null);

    const output = circuit.run({
        inp1: 1,
        inp2: 0
    });

    expect(output.outputs.out1).toBe(0);
});

test('Simple Combinatorial 4', async() => {
    const circuit = project.getCircuitByName('Combinatorial');
    expect(circuit).not.toBe(null);

    const output = circuit.run({
        inp1: 1,
        inp2: 1
    });

    expect(output.outputs.out1).toBe(1);
});

test('Simple Sequential 1', async () => {
    const circuit = project.getCircuitByName('Sequential');
    expect(circuit).not.toBe(null);

    const outputs = circuit.run({
        Reset: 0,
        Set: 1
    }).outputs;

    expect(outputs).toStrictEqual({
        Q: 1,
        NotQ: 0
    });
});

test('Simple Sequential 2', async () => {
    const circuit = project.getCircuitByName('Sequential');
    expect(circuit).not.toBe(null);

    const outputs = circuit.run({
        Reset: 1,
        Set: 0
    }).outputs;

    expect(outputs).toStrictEqual({
        Q: 0,
        NotQ: 1
    });
});

test('Simple Sequential 3', async () => {
    const circuit = project.getCircuitByName('Sequential');
    expect(circuit).not.toBe(null);

    const outputs = circuit.run({
        Reset: 1,
        Set: 0
    }).outputs;

    expect(outputs).toStrictEqual({
        Q: 0,
        NotQ: 1
    });
});