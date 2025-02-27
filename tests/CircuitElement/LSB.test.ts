import { LSB } from "../../src/CircuitElement/LSB";

test("Should return 0", () => {
  expect(new LSB("010").resolve()).toBe(0);
});

test("Should return 0", () => {
  expect(new LSB("000").resolve()).toBe(0);
});

test("Should return 0", () => {
  expect(new LSB("100").resolve()).toBe(0);
});

test("Should return 1", () => {
  expect(new LSB("011").resolve()).toBe(1);
});

test("Should return 1", () => {
  expect(new LSB("111").resolve()).toBe(1);
});

test("Should return 1", () => {
  expect(new LSB("001").resolve()).toBe(1);
});
