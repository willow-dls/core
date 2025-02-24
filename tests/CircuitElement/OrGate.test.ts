import { BitString } from "../../src/BitString";
import { OrGate } from "../../src/CircuitElement/OrGate";

test('Should return 1', () => {
    expect(new OrGate([], []).evaluate(
        BitString.from('0'), 
        BitString.from('1')
    ).toString()).toBe('1');
})

test('Should return 1', () => {
    expect(new OrGate([], []).evaluate(
        BitString.from('1'), 
        BitString.from('0')
    ).toString()).toBe('1');
})

test('Should return 0', () => {
    expect(new OrGate([], []).evaluate(
        BitString.from('0'), 
        BitString.from('0')
    ).toString()).toBe('0');
})

test('Should return 1', () => {
    expect(new OrGate([], []).evaluate(
        BitString.from('1'), 
        BitString.from('1')
    ).toString()).toBe('1');
})
