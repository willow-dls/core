import { BitString } from "../../src/BitString";
import { XorGate } from "../../src/CircuitElement/XorGate";

test("Should return 0", () => {
  expect(
    new XorGate([], [])
      .evaluate(new BitString("1"), new BitString("1"))
      .toString(),
  ).toBe("0");
});

test("Should return 1", () => {
  expect(
    new XorGate([], [])
      .evaluate(new BitString("1"), new BitString("0"))
      .toString(),
  ).toBe("1");
});

test("Should return 0", () => {
  expect(
    new XorGate([], [])
      .evaluate(new BitString("0"), new BitString("0"))
      .toString(),
  ).toBe("0");
});

test("Should return 1", () => {
  expect(
    new XorGate([], [])
      .evaluate(new BitString("0"), new BitString("1"))
      .toString(),
  ).toBe("1");
});
