import {loadProject} from '../../src/CircuitLoader';

import {CircuitVerseLoader} from '../../src/CircuitLoader/CircuitVerseLoader';

let project;

beforeAll(async () => {
    project = await loadProject(CircuitVerseLoader, 'tests/cv/AdditionalInputs.cv');
});



//Button Tests
test('Button 1', async() => {
    const circuit = project.getCircuitByName('Button');

    const output = circuit.run({
        inp1: '0',
        btn: '1'
    });

    expect(output.outputs.out1.toString()).toBe('0');
});

test('Button 2', async() => {
    const circuit = project.getCircuitByName('Button');

    const output = circuit.run({
        inp1: '1',
        btn: '1'
    });

    expect(output.outputs.out1.toString()).toBe('1');
});

test('Button 3', async() => {
    const circuit = project.getCircuitByName('Button');

    const output = circuit.run({
        inp1: '0',
        btn: '0'
    });

    expect(output.outputs.out1.toString()).toBe('0');
});

test('Button 4', async() => {
    const circuit = project.getCircuitByName('Button');

    const output = circuit.run({
        inp1: '1',
        btn: '0'
    });

    expect(output.outputs.out1.toString()).toBe('0');
});

//Constant Tests

test('Constant 1', async() => {
    const circuit = project.getCircuitByName('Constant');

    const output = circuit.run({
        inp1: '0',
        const: '1'
    });

    expect(output.outputs.out1.toString()).toBe('0');
});

test('Constant 2', async() => {
    const circuit = project.getCircuitByName('Constant');

    const output = circuit.run({
        inp1: '1',
        const: '1'
    });

    expect(output.outputs.out1.toString()).toBe('1');
});

test('Constant 3', async() => {
    const circuit = project.getCircuitByName('Constant');

    const output = circuit.run({
        inp1: '0',
        const: '0'
    });

    expect(output.outputs.out1.toString()).toBe('0');
});

test('Constant 4', async() => {
    const circuit = project.getCircuitByName('Constant');

    const output = circuit.run({
        inp1: '1',
        const: '0'
    });

    expect(output.outputs.out1.toString()).toBe('0');
});

test.failing('Constant 5', async() => {
    const circuit = project.getCircuitByName('Constant');

    const output = circuit.run({
        inp1: '0',
        const: '111'
    });

    expect(output.outputs.out1.toString()).toBe('0');
});

//Ground Tests

test('GND 1', async() => {
    const circuit = project.getCircuitByName('GND');

    const output = circuit.run({
        inp1: '0',
    });

    expect(output.outputs.out1.toString()).toBe('0');
});

test('GND 2', async() => {
    const circuit = project.getCircuitByName('GND');

    const output = circuit.run({
        inp1: '1',
    });

    expect(output.outputs.out1.toString()).toBe('0');
});

//Power Tests

test('POW 1', async() => {
    const circuit = project.getCircuitByName('POW');

    const output = circuit.run({
        inp1: '0',
    });

    expect(output.outputs.out1.toString()).toBe('0');
});

test('POW 2', async() => {
    const circuit = project.getCircuitByName('POW');

    const output = circuit.run({
        inp1: '1',
    });

    expect(output.outputs.out1.toString()).toBe('1');
});

//Step Tests

test('Step 1', async() => {
    const circuit = project.getCircuitByName('Step');

    const output = circuit.run({
        inp1: '0',
        stp: '1'
    });

    expect(output.outputs.out1.toString()).toBe('0');
});

test('Step 2', async() => {
    const circuit = project.getCircuitByName('Step');

    const output = circuit.run({
        inp1: '1',
        stp: '1'
    });

    expect(output.outputs.out1.toString()).toBe('1');
});

test('Step 3', async() => {
    const circuit = project.getCircuitByName('Step');

    const output = circuit.run({
        inp1: '0',
        stp: '0'
    });

    expect(output.outputs.out1.toString()).toBe('0');
});

test('Step 4', async() => {
    const circuit = project.getCircuitByName('Step');

    const output = circuit.run({
        inp1: '1',
        stp: '0'
    });

    expect(output.outputs.out1.toString()).toBe('0');
});
