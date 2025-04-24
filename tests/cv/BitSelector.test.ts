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

import { Circuit } from "../../src/Circuit";
import { loadProject } from "../../src/CircuitLoader";
import { CircuitVerseLoader } from "../../src/CircuitLoader/CircuitVerseLoader";

let bitSelector: Circuit;

beforeAll(async () => {
  const project = await loadProject(
    CircuitVerseLoader,
    "tests/cv/BitSelector.cv",
  );
  bitSelector = project.getCircuitByName("BitSelector");
});

test("Should return 1", () => {
  const inputs = {
    Input: "1000",
    Selector: "11",
  };

  const results = bitSelector.run(inputs);

  expect(results.outputs.Output.toString()).toStrictEqual("1");
});

test("Should return 1", () => {
  const inputs = {
    Input: "0001",
    Selector: "00",
  };

  const results = bitSelector.run(inputs);

  expect(results.outputs.Output.toString()).toStrictEqual("1");
});

test("Should return 0", () => {
  const inputs = {
    Input: "0001",
    Selector: "10",
  };

  const results = bitSelector.run(inputs);

  expect(results.outputs.Output.toString()).toStrictEqual("0");
});

test("Should not equal 1", () => {
  const inputs = {
    Input: "0001",
    Selector: "01",
  };

  const results = bitSelector.run(inputs);

  expect(results.outputs.Output.toString()).not.toStrictEqual("1");
});

test("Should equal 0", () => {
  const inputs = {
    Input: "1011",
    Selector: "10",
  };

  const results = bitSelector.run(inputs);

  expect(results.outputs.Output.toString()).toStrictEqual("0");
});
