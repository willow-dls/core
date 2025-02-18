import {loadProject} from '../src/CircuitLoader';
import {CircuitVerseLoader} from '../src/CircuitLoader/CircuitVerseLoader';

let project;

beforeAll(async () => {
    project = await loadProject(CircuitVerseLoader, 'tests/cv/Simple.cv');
    //return project;
});

test('Simple Combinatorial 1', async() => {
    const circuit = project.getCircuitByName('Combinatorial');

    const output = circuit.run({
        inp1: 0,
        inp2: 0
    });

    expect(output.outputs.out1).toBe(0);
});

test('Simple Combinatorial 2', async() => {
    const circuit = project.getCircuitByName('Combinatorial');

    const output = circuit.run({
        inp1: 0,
        inp2: 1
    });

    expect(output.outputs.out1).toBe(0);
});

test('Simple Combinatorial 3', async() => {
    const circuit = project.getCircuitByName('Combinatorial');

    const output = circuit.run({
        inp1: 1,
        inp2: 0
    });

    expect(output.outputs.out1).toBe(0);
});

test('Simple Combinatorial 4', async() => {
    const circuit = project.getCircuitByName('Combinatorial');

    const output = circuit.run({
        inp1: 1,
        inp2: 1
    });

    expect(output.outputs.out1).toBe(1);
});

test('Simple Sequential 1', async () => {
    const circuit = project.getCircuitByName('Sequential');

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

    const outputs = circuit.run({
        Reset: 1,
        Set: 0
    }).outputs;

    expect(outputs).toStrictEqual({
        Q: 0,
        NotQ: 1
    });
});

test('Simple Sequential 4', async () => {
    const circuit = project.getCircuitByName('Sequential');

    const outputs = circuit.run({
        Reset: 1,
        Set: 1
    }).outputs;

    expect(outputs).toStrictEqual({
        Q: 0,
        NotQ: 0
    });
});

test('Simple Sequential 5', async () => {
    const circuit = project.getCircuitByName('Sequential');

    const outputs = circuit.run({
        Reset: 0,
        Set: 0,
        Q: 1
    }).outputs;

    expect(outputs).toStrictEqual({
        Q: 1,
        NotQ: 0
    });
});

test('Simple Subcircuit 1', async() => {
    const circuit = project.getCircuitByName('Subcircuit');

    let outputs = circuit.run({
        inp1: 1,
        inp2: 0
    }).outputs;

    expect(outputs).toStrictEqual({
        out1: 1
    });
});

test('Simple Subcircuit 2', async() => {
    const circuit = project.getCircuitByName('Subcircuit');

    let outputs = circuit.run({
        inp1: 0,
        inp2: 1
    }).outputs;

    expect(outputs).toStrictEqual({
        out1: 0
    });
});

test('Simple Subcircuit 3', async() => {
    const circuit = project.getCircuitByName('Subcircuit');

    let outputs = circuit.run({
        inp1: 1,
        inp2: 1
    }).outputs;

    expect(outputs).toStrictEqual({
        out1: 0
    });
});

test('Simple Subcircuit 4', async() => {
    const circuit = project.getCircuitByName('Subcircuit');

    let outputs = circuit.run({
        inp1: 0,
        inp2: 0
    }).outputs;

    expect(outputs).toStrictEqual({
        out1: 0
    });
});
