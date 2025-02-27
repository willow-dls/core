import { Multiplexer } from "../../src/CircuitElement/Multiplexer";

test("Signal low: Should return 0", () => {
  expect(new Multiplexer(0, 0, 0).resolve()).toBe(0);
});

test("Signal low: Should return 0", () => {
  expect(new Multiplexer(0, 0, 1).resolve()).toBe(0);
});

test("Signal low: Should return 1", () => {
  expect(new Multiplexer(0, 1, 0).resolve()).toBe(1);
});

test("Signal low: Should return 1", () => {
  expect(new Multiplexer(0, 1, 1).resolve()).toBe(1);
});

test("Signal high: Should return 0", () => {
  expect(new Multiplexer(1, 0, 0).resolve()).toBe(0);
});

test("signal high: Should return 1", () => {
  expect(new Multiplexer(1, 0, 1).resolve()).toBe(1);
});

test("Signal high: Should return 0", () => {
  expect(new Multiplexer(1, 1, 0).resolve()).toBe(0);
});

test("Signal high: Should return 1", () => {
  expect(new Multiplexer(1, 1, 1).resolve()).toBe(1);
});
