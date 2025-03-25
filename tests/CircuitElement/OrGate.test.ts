import { BitString } from "../../src/BitString";
import { OrGate } from "../../src/CircuitElement/OrGate";

test("Should return 1", () => {
  expect(
    new OrGate([], [])
      .evaluate(new BitString("0"), new BitString("1"))
      .toString(),
  ).toBe("1");
});

test("Should return 1", () => {
  expect(
    new OrGate([], [])
      .evaluate(new BitString("1"), new BitString("0"))
      .toString(),
  ).toBe("1");
});

test("Should return 0", () => {
  expect(
    new OrGate([], [])
      .evaluate(new BitString("0"), new BitString("0"))
      .toString(),
  ).toBe("0");
});

test("Should return 1", () => {
  expect(
    new OrGate([], [])
      .evaluate(new BitString("1"), new BitString("1"))
      .toString(),
  ).toBe("1");
});
