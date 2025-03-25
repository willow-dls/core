import { BitString } from "../../src/BitString";
import { NandGate } from "../../src/CircuitElement/NandGate";

test("Should return 1", () => {
  expect(
    new NandGate([], [])
      .evaluate(new BitString("0"), new BitString("1"))
      .toString(),
  ).toBe("1");
});

test("Should return 1", () => {
  expect(
    new NandGate([], [])
      .evaluate(new BitString("1"), new BitString("0"))
      .toString(),
  ).toBe("1");
});

test("Should return 1", () => {
  expect(
    new NandGate([], [])
      .evaluate(new BitString("0"), new BitString("0"))
      .toString(),
  ).toBe("1");
});

test("Should return 0", () => {
  expect(
    new NandGate([], [])
      .evaluate(new BitString("1"), new BitString("1"))
      .toString(),
  ).toBe("0");
});
