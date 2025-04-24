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
import { LogisimLoader } from "../../src/CircuitLoader/LogisimLoader";
import { FileLogger } from "../../src/CircuitLogger/FileLogger";
import { LogLevel } from "../../src/CircuitLogger";

let circ;
// const logger = new FileLogger('pow.log');
// test("Load Logisim file by name", async () => {
//     const project = await loadProject(LogisimLoader, "tests/Logisim/AndGate.circ");
//     expect(project).not.toBe(null);
// });

beforeAll(async () => {
  // logger.setLevel(LogLevel.TRACE)
  const project = await loadProject(
    LogisimLoader,
    "tests/Logisim/BitWidth.circ",
  );
  circ = project.getCircuitByName("main");
  // logger.attachTo(circ)
});
// afterAll(async () => {
//     logger.close();
// });

const table = [
  ["0000", "0000", "0000"],
  ["0001", "0001", "0001"],
  ["0010", "1110", "0010"],
  ["0011", "0011", "0011"],
  ["1111", "0100", "0100"],
  ["0101", "1111", "0101"],
  ["0110", "0111", "0110"],
  ["1111", "0111", "0111"],
  ["1110", "1000", "1000"],
  ["1010", "1001", "1000"],
  ["1100", "0011", "0000"],
  ["0000", "1111", "0000"],
  ["1111", "0000", "0000"],
  ["1111", "1111", "1111"],
];
for (let entry of table) {
  test("Width 4 AND 1", async () => {
    const inputs = {
      Input1: new BitString(entry[0]),
      Input2: new BitString(entry[1]),
    };
    const outputs = {
      Output1: new BitString(entry[2]),
    };
    const results = circ.run(inputs);
    console.log(results);
    expect(results.outputs.Output1.toString()).toStrictEqual(
      outputs.Output1.toString(),
    );
  });
}
