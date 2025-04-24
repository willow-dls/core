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
import { loadProject } from "../../src/CircuitLoader";
import { CircuitVerseLoader } from "../../src/CircuitLoader/CircuitVerseLoader";

let adder;

beforeAll(async () => {
  const project = await loadProject(
    CircuitVerseLoader,
    "tests/cv/Full Adder.cv",
  );
  adder = project.getCircuitByName("Full Adder");
});

// Truth table for full adder, with columns A, B, CIN, Sum, and COUT.
// (see below).
const table = [
  "00000",
  "00110",
  "01010",
  "01101",
  "10010",
  "10101",
  "11001",
  "11111",
];

for (const entry of table) {
  const inputs = {
    A: new BitString(entry[0]),
    B: new BitString(entry[1]),
    CIN: new BitString(entry[2]),
  };

  const outputs = {
    Sum: new BitString(entry[3]),
    COUT: new BitString(entry[4]),
  };

  test(`Full Adder Truth Table: A = ${inputs.A}, B = ${inputs.B}, CIN = ${inputs.CIN} => Sum = ${outputs.Sum}, COUT = ${outputs.COUT}`, () => {
    const results = adder.run(inputs);

    expect(results.outputs).toStrictEqual(outputs);
  });
}
