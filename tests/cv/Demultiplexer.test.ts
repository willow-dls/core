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

import { loadProject } from "../../src/CircuitLoader";
import { CircuitVerseLoader } from "../../src/CircuitLoader/CircuitVerseLoader";
import { BitString } from "../../src/BitString";
import { Circuit } from "../../src/Circuit";

let multiplexer: Circuit;

beforeAll(async () => {
  const project = await loadProject(
    CircuitVerseLoader,
    "tests/cv/Demultiplexer.cv",
  );
  multiplexer = project.getCircuitByName("Demultiplexer");
});

test("Expect First Input", () => {
  const inputs = {
    InputA: new BitString("1000", 4),
    Signal: new BitString("0", 1),
  };

  const results = multiplexer.run(inputs);

  expect(results.outputs.OutputA.toString()).toStrictEqual("1000");
  expect(results.outputs.OutputB.toString()).toStrictEqual("0000");
});

test("Expect Second Input", () => {
  const inputs = {
    InputA: new BitString("1000", 4),
    Signal: new BitString("1", 1),
  };

  const results = multiplexer.run(inputs);

  expect(results.outputs.OutputA.toString()).toStrictEqual("0000");
  expect(results.outputs.OutputB.toString()).toStrictEqual("1000");
});
