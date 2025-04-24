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

import { beforeAll, test, expect } from "@jest/globals";

import { BitString } from "../src/BitString";
import { loadProject } from "../src/CircuitLoader";
import { CircuitVerseLoader } from "../src/CircuitLoader/CircuitVerseLoader";

let circuit_Encoder;
let circuit_Decoder;

beforeAll(async () => {
  const project = await loadProject(CircuitVerseLoader, "tests/cv/Encoders.cv");
  circuit_Encoder = project.getCircuitByName("Encoder");
  circuit_Decoder = project.getCircuitByName("Decoder");
});

const table1_in = [
  ["0", "0", "0", "0"],
  ["0", "0", "0", "1"],
  ["0", "0", "1", "0"],
  ["0", "0", "1", "1"],
  ["0", "1", "0", "0"],
  ["0", "1", "0", "1"],
  ["0", "1", "1", "0"],
  ["0", "1", "1", "1"],
  ["1", "0", "0", "0"],
  ["1", "0", "0", "1"],
  ["1", "0", "1", "0"],
  ["1", "0", "1", "1"],
  ["1", "1", "0", "0"],
  ["1", "1", "0", "1"],
  ["1", "1", "1", "0"],
  ["1", "1", "1", "1"],
];

const table1_out = [
  ["0", "0"],
  ["0", "0"],
  ["0", "1"],
  ["0", "1"],
  ["1", "0"],
  ["1", "0"],
  ["1", "0"],
  ["1", "0"],
  ["1", "1"],
  ["1", "1"],
  ["1", "1"],
  ["1", "1"],
  ["1", "1"],
  ["1", "1"],
  ["1", "1"],
  ["1", "1"],
];

const table2_in = ["00", "01", "10", "11"];
const table2_out = [
  ["0", "0", "0", "1"],
  ["0", "0", "1", "0"],
  ["0", "1", "0", "0"],
  ["1", "0", "0", "0"],
];

for (let i = 0; i < table1_in.length; i++) {
  test(`Priority Encoder ${i}`, async () => {
    const inputs = {
      inp0: new BitString(table1_in[i][3]),
      inp1: new BitString(table1_in[i][2]),
      inp2: new BitString(table1_in[i][1]),
      inp3: new BitString(table1_in[i][0]),
      enable: BitString.high(),
    };

    const outputs = {
      out0: new BitString(table1_out[i][1]),
      out1: new BitString(table1_out[i][0]),
    };

    const results = circuit_Encoder.run(inputs);

    expect(results.outputs).toStrictEqual(outputs);
  });
}

for (let i = 0; i < table2_in.length; i++) {
  test(`Decoder test ${i}`, () => {
    const inputs = {
      inp1: new BitString(table2_in[i]),
    };

    const outputs = {
      out0: new BitString(table2_out[i][3]),
      out1: new BitString(table2_out[i][2]),
      out2: new BitString(table2_out[i][1]),
      out3: new BitString(table2_out[i][0]),
    };

    const results = circuit_Decoder.run(inputs);

    expect(results.outputs).toStrictEqual(outputs);
  });
}
