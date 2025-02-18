import { NotGate } from "../../src/CircuitElement/NotGate";

test("Should return 0", () => {
  expect(new NotGate([], []).evaluate(0, 1)).toBe(0);
});

test("Should return 1", () => {
  expect(new NotGate([], []).evaluate(0, 0)).toBe(1);
});
