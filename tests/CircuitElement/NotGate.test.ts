import { BitString } from "../../src/BitString";
import { NotGate } from "../../src/CircuitElement/NotGate";

test("Should return 0", () => {
  expect(new NotGate([], []).evaluate(
    BitString.from('0'), 
    BitString.from('1')
  ).toString()).toBe('0');
});

test("Should return 1", () => {
  expect(new NotGate([], []).evaluate(
    BitString.from('0'), 
    BitString.from('0')
  ).toString()).toBe('1');
});