import { BitString } from "../../src/BitString";
import {AndGate} from "../../src/CircuitElement/AndGate";

test('Should return 0', () => {
    expect(new AndGate([], []).evaluate(
        new BitString('0'), 
        new BitString('1')
    ).toString()).toBe('0');
})

test('Should return 0', () => {
    expect(new AndGate([], []).evaluate(
        new BitString('1'), 
        new BitString('0')
    ).toString()).toBe('0');
})

test('Should return 0', () => {
    expect(new AndGate([], []).evaluate(
        new BitString('0'), 
        new BitString('0')
    ).toString()).toBe('0');
})

test('Should return 1', () => {
    expect(new AndGate([], []).evaluate(
        new BitString('1'), 
        new BitString('1')
    ).toString()).toBe('1');
})
