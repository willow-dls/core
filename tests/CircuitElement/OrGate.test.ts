import { OrGate } from "../../src/CircuitElement/OrGate";

test("Should return 0", () => {
  expect(new OrGate([], []).evaluate(0, 0)).toBe(0);
});

test("Should return 1", () => {
  expect(new OrGate([], []).evaluate(1, 0)).toBe(1);
});

test("Should return 1", () => {
  expect(new OrGate([], []).evaluate(0, 1)).toBe(1);
});

test("Should return 1", () => {
  expect(new OrGate([], []).evaluate(1, 1)).toBe(1);
});
