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

// const logger = new FileLogger('tristate-splitter.log');
let circuit;

beforeAll(async () => {
  //const logger = new ConsoleLogger();
  // logger.setLevel(LogLevel.TRACE).setSubsystems(/^SplitterElement$/, /^Circuit$/);

  const project = await loadProject(
    CircuitVerseLoader,
    "tests/cv/TriStateSplitter.cv",
  );
  circuit = project.getCircuitByName("Main");

  //adder = null;
});

// afterAll(async() => {
//     await logger.close();
// });

const table = [
  ["1010", "0101", "0", "1010"],
  ["1010", "0101", "1", "0101"],
];

for (const entry of table) {
  const inputs = {
    Line0: new BitString(entry[0]),
    Line1: new BitString(entry[1]),
    Select: new BitString(entry[2]),
  };

  const outputs = {
    Output1: new BitString(entry[3]),
    Output2: new BitString(entry[3]),
  };

  test(`[Line0 = '${inputs.Line0}', Line1 = '${inputs.Line1}', Select = '${inputs.Select}'] => [Output1 = '${outputs.Output1}', Output2 = '${outputs.Output2}']`, () => {
    const results = circuit.run(inputs);

    expect(results.outputs).toStrictEqual(outputs);
  });
}
