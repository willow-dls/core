import { BitString } from "../../src/BitString";
import { XnorGate } from "../../src/CircuitElement/XnorGate";

test("Should return 1", () => {
  expect(new XnorGate([], []).evaluate(
    BitString.from('1'),
    BitString.from('1')
  ).toString()).toBe('1');
});

test("Should return 0", () => {
  expect(new XnorGate([], []).evaluate(
    BitString.from('1'),
    BitString.from('0')
  ).toString()).toBe('0');
});

test("Should return 1", () => {
  expect(new XnorGate([], []).evaluate(
    BitString.from('0'),
    BitString.from('0')
  ).toString()).toBe('1');
});

test("Should return 0", () => {
  expect(new XnorGate([], []).evaluate(
    BitString.from('0'),
    BitString.from('1')
  ).toString()).toBe('0');
});
