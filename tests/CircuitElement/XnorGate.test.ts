import { XnorGate } from "../../src/CircuitElement/XnorGate";

test("Should return 1", () => {
  expect(new XnorGate([], []).evaluate(1, 1)).toBe(1);
});

test("Should return 0", () => {
  expect(new XnorGate([], []).evaluate(1, 0)).toBe(0);
});

test("Should return 1", () => {
  expect(new XnorGate([], []).evaluate(0, 0)).toBe(1);
});

test("Should return 0", () => {
  expect(new XnorGate([], []).evaluate(0, 1)).toBe(0);
});
