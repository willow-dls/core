import { BitString } from "../../src/BitString";
import {AndGate} from "../../src/CircuitElement/AndGate";

test('Should return 0', () => {
    expect(new AndGate([], []).evaluate(
        BitString.from('0'), 
        BitString.from('1')
    ).toString()).toBe('0');
})

test('Should return 0', () => {
    expect(new AndGate([], []).evaluate(
        BitString.from('1'), 
        BitString.from('0')
    ).toString()).toBe('0');
})

test('Should return 0', () => {
    expect(new AndGate([], []).evaluate(
        BitString.from('0'), 
        BitString.from('0')
    ).toString()).toBe('0');
})

test('Should return 1', () => {
    expect(new AndGate([], []).evaluate(
        BitString.from('1'), 
        BitString.from('1')
    ).toString()).toBe('1');
})
