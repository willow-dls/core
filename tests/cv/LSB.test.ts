import { expect, beforeAll, test } from "@jest/globals";

import { BitString } from "../../src/BitString";
import { Circuit } from "../../src/Circuit";
import { loadProject } from "../../src/CircuitLoader";
import { CircuitVerseLoader } from "../../src/CircuitLoader/CircuitVerseLoader";

let lsb: Circuit;

beforeAll(async () => {
  const project = await loadProject(CircuitVerseLoader, "tests/cv/LSB.cv");
  lsb = project.getCircuitByName("LSB");
});

test("Index 0 Output", () => {
  const inputs = {
    InputA: new BitString("1001", 4),
  };

  const results = lsb.run(inputs);

  expect(results.outputs.OutputA.toString()).toStrictEqual("0000");
  expect(results.outputs.OutputB.toString()).toStrictEqual("1");
});

test("Index 1 Output", () => {
  const inputs = {
    InputA: new BitString("0010", 4),
  };

  const results = lsb.run(inputs);

  expect(results.outputs.OutputA.toString()).toStrictEqual("0001");
  expect(results.outputs.OutputB.toString()).toStrictEqual("1");
});

test("Index 2 Output", () => {
  const inputs = {
    InputA: new BitString("0100", 4),
  };

  const results = lsb.run(inputs);

  expect(results.outputs.OutputA.toString()).toStrictEqual("0010");
  expect(results.outputs.OutputB.toString()).toStrictEqual("1");
});

test("Index 3 Output", () => {
  const inputs = {
    InputA: new BitString("1000", 4),
  };

  const results = lsb.run(inputs);

  expect(results.outputs.OutputA.toString()).toStrictEqual("0011");
  expect(results.outputs.OutputB.toString()).toStrictEqual("1");
});

test("No Input", () => {
  const inputs = {
    InputA: new BitString("0000", 4),
  };

  const results = lsb.run(inputs);

  expect(results.outputs.OutputA.toString()).toBe("0000");
  expect(results.outputs.OutputB.toString()).toBe("0");
});
