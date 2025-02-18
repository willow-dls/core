import {AndGate} from "../../src/CircuitElement/AndGate";

test('Should return 0', () => {
    expect(new AndGate([], []).evaluate(0, 1)).toBe(0);
})

test('Should return 0', () => {
    expect(new AndGate([], []).evaluate(1, 0)).toBe(0);
})

test('Should return 1', () => {
    expect(new AndGate([], []).evaluate(1, 1)).toBe(1);
})

test('Should return 1', () => {
    expect(new AndGate([], []).evaluate(1, 1)).toBe(1);
})
