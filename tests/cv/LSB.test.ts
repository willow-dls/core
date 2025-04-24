/*
 * Copyright (c) 2025 Jordan Bancino <jordan@bancino.net>
 * Copyright (c) 2025 Austin Hargis <hargisa@mail.gvsu.edu>
 * Copyright (c) 2025 Aaron MacDougall <macdouaa@mail.gvsu.edu>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

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
