import { XorGate } from "../../src/CircuitElement/XorGate";

test("Should return 0", () => {
  expect(new XorGate([], []).evaluate(0, 0)).toBe(0);
});

test("Should return 0", () => {
  expect(new XorGate([], []).evaluate(1, 1)).toBe(0);
});

test("Should return 1", () => {
  expect(new XorGate([], []).evaluate(0, 1)).toBe(1);
});

test("Should return 1", () => {
  expect(new XorGate([], []).evaluate(1, 0)).toBe(1);
});
