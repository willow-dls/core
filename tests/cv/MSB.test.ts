import { expect, beforeAll, test } from "@jest/globals";

import { BitString } from "../../src/BitString";
import { Circuit } from "../../src/Circuit";
import { loadProject } from "../../src/CircuitLoader";
import { CircuitVerseLoader } from "../../src/CircuitLoader/CircuitVerseLoader";

let msb: Circuit;

beforeAll(async () => {
  const project = await loadProject(CircuitVerseLoader, "tests/cv/MSB.cv");
  msb = project.getCircuitByName("MSB");
});

test("No MSB", () => {
  const inputs = {
    InputA: new BitString("0000", 4),
  };

  const results = msb.run(inputs);

  expect(results.outputs.OutputA.toString()).toStrictEqual("0000");
  expect(results.outputs.OutputB.toString()).toStrictEqual("0");
});

test("All indices filled", () => {
  const inputs = {
    InputA: new BitString("1111", 4),
  };

  const results = msb.run(inputs);

  expect(results.outputs.OutputA.toString()).toStrictEqual("0011");
  expect(results.outputs.OutputB.toString()).toStrictEqual("1");
});

test("Index 3 Output", () => {
  const inputs = {
    InputA: new BitString("1000", 4),
  };

  const results = msb.run(inputs);

  expect(results.outputs.OutputA.toString()).toStrictEqual("0011");
  expect(results.outputs.OutputB.toString()).toStrictEqual("1");
});

test("Last indice filled", () => {
  const inputs = {
    InputA: new BitString("0001", 4),
  };

  const results = msb.run(inputs);

  expect(results.outputs.OutputA.toString()).toStrictEqual("0000");
  expect(results.outputs.OutputB.toString()).toStrictEqual("1");
});

test("No MSB Failure Test", () => {
  const inputs = {
    InputA: new BitString("0000", 4),
  };

  const results = msb.run(inputs);

  expect(results.outputs.OutputA.toString()).toStrictEqual("0000");
  expect(results.outputs.OutputB.toString()).not.toStrictEqual("1");
});
