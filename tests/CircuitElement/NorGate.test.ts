import { NorGate } from "../../src/CircuitElement/NorGate";

test("Should return 1", () => {
  expect(new NorGate([], []).evaluate(0, 0)).toBe(1);
});

test("Should return 0", () => {
  expect(new NorGate([], []).evaluate(1, 0)).toBe(0);
});

test("Should return 0", () => {
  expect(new NorGate([], []).evaluate(0, 1)).toBe(0);
});

test("Should return 0", () => {
  expect(new NorGate([], []).evaluate(1, 1)).toBe(0);
});
