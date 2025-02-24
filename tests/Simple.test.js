import {loadProject} from '../src/CircuitLoader';
import {BitString} from '../src/BitString';

import {CircuitVerseLoader} from '../src/CircuitLoader/CircuitVerseLoader';

let project;

beforeAll(async () => {
    project = await loadProject(CircuitVerseLoader, 'tests/cv/Simple.cv');
});

test('Simple Combinatorial 1', async() => {
    const circuit = project.getCircuitByName('Combinatorial');

    const output = circuit.run({
        inp1: BitString.from('0'),
        inp2: BitString.from('0')
    });

    expect(output.outputs.out1.toString()).toBe('0');
});

test('Simple Combinatorial 2', async() => {
    const circuit = project.getCircuitByName('Combinatorial');

    const output = circuit.run({
        inp1: BitString.from('0'),
        inp2: BitString.from('1')
    });

    expect(output.outputs.out1.toString()).toBe('0');
});

test('Simple Combinatorial 3', async() => {
    const circuit = project.getCircuitByName('Combinatorial');

    const output = circuit.run({
        inp1: BitString.from('1'),
        inp2: BitString.from('0')
    });

    expect(output.outputs.out1.toString()).toBe('0');
});

test('Simple Combinatorial 4', async() => {
    const circuit = project.getCircuitByName('Combinatorial');

    const output = circuit.run({
        inp1: BitString.from('1'),
        inp2: BitString.from('1')
    });

    expect(output.outputs.out1.toString()).toBe('1');
});

test('Simple Sequential 1', async () => {
    const circuit = project.getCircuitByName('Sequential');

    const outputs = circuit.run({
        Reset: BitString.from('0'),
        Set: BitString.from('1')
    }).outputs;

    expect(outputs).toStrictEqual({
        Q: BitString.from('1'),
        NotQ: BitString.from('0')
    });
});

test('Simple Sequential 2', async () => {
    const circuit = project.getCircuitByName('Sequential');

    const outputs = circuit.run({
        Reset: BitString.from('1'),
        Set: BitString.from('0')
    }).outputs;

    expect(outputs).toStrictEqual({
        Q: BitString.from('0'),
        NotQ: BitString.from('1')
    });
});

test('Simple Sequential 3', async () => {
    const circuit = project.getCircuitByName('Sequential');

    const outputs = circuit.run({
        Reset: BitString.from('1'),
        Set: BitString.from('0')
    }).outputs;

    expect(outputs).toStrictEqual({
        Q: BitString.from('0'),
        NotQ: BitString.from('1')
    });
});

test('Simple Sequential 4', async () => {
    const circuit = project.getCircuitByName('Sequential');

    const outputs = circuit.run({
        Reset: BitString.from('1'),
        Set: BitString.from('1')
    }).outputs;

    expect(outputs).toStrictEqual({
        Q: BitString.from('0'),
        NotQ: BitString.from('0')
    });
});

test('Simple Sequential 5', async () => {
    const circuit = project.getCircuitByName('Sequential');

    const outputs = circuit.run({
        Reset: BitString.from('0'),
        Set: BitString.from('0'),
        Q: BitString.from('1')
    }).outputs;

    expect(outputs).toStrictEqual({
        Q: BitString.from('1'),
        NotQ: BitString.from('0')
    });
});

test('Simple Subcircuit 1', async() => {
    const circuit = project.getCircuitByName('Subcircuit');

    let outputs = circuit.run({
        inp1: BitString.from('1'),
        inp2: BitString.from('0')
    }).outputs;

    expect(outputs).toStrictEqual({
        out1: BitString.from('1')
    });
});

test('Simple Subcircuit 2', async() => {
    const circuit = project.getCircuitByName('Subcircuit');

    let outputs = circuit.run({
        inp1: BitString.from('0'),
        inp2: BitString.from('1')
    }).outputs;

    expect(outputs).toStrictEqual({
        out1: BitString.from('0')
    });
});

test('Simple Subcircuit 3', async() => {
    const circuit = project.getCircuitByName('Subcircuit');

    let outputs = circuit.run({
        inp1: BitString.from('1'),
        inp2: BitString.from('1')
    }).outputs;

    expect(outputs).toStrictEqual({
        out1: BitString.from('0')
    });
});

test('Simple Subcircuit 4', async() => {
    const circuit = project.getCircuitByName('Subcircuit');

    let outputs = circuit.run({
        inp1: BitString.from('0'),
        inp2: BitString.from('0')
    }).outputs;

    expect(outputs).toStrictEqual({
        out1: BitString.from('0')
    });
});
