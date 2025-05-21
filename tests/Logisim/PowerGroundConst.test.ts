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
// const logger = new FileLogger("pow.log");
// test("Load Logisim file by name", async () => {
//     const project = await loadProject(LogisimLoader, "tests/Logisim/AndGate.circ");
//     expect(project).not.toBe(null);
// });

beforeAll(async () => {
  // logger.setLevel(LogLevel.TRACE);
  const project = await loadProject(
    LogisimLoader,
    "tests/Logisim/PowerGroundConst.circ",
  );
  circ = project.getCircuitByName("main");
  // logger.attachTo(circ);
});

// afterAll(async () => {
//   logger.close();
// });

test("Power", async () => {
  const outputs = {
    Output1: new BitString("1"),
  };
  const results = circ.run();
  expect(results.outputs.Output1.toString()).toStrictEqual(
    outputs.Output1.toString(),
  );
});

test("Ground", async () => {
  const outputs = {
    Output2: new BitString("0"),
  };
  const results = circ.run();
  expect(results.outputs.Output2.toString()).toStrictEqual(
    outputs.Output2.toString(),
  );
});

test("Power not", async () => {
  const outputs = {
    Output3: new BitString("0"),
  };
  const results = circ.run();
  expect(results.outputs.Output3.toString()).toStrictEqual(
    outputs.Output3.toString(),
  );
});

test("Ground not", async () => {
  const outputs = {
    Output4: new BitString("1"),
  };
  const results = circ.run();
  expect(results.outputs.Output4.toString()).toStrictEqual(
    outputs.Output4.toString(),
  );
});

test("Constant 0", async () => {
  const outputs = {
    Output5: new BitString("0"),
  };
  const results = circ.run();
  expect(results.outputs.Output5.toString()).toStrictEqual(
    outputs.Output5.toString(),
  );
});

test("Constant 1 Not", async () => {
  const outputs = {
    Output6: new BitString("0"),
  };
  const results = circ.run();
  expect(results.outputs.Output6.toString()).toStrictEqual(
    outputs.Output6.toString(),
  );
});
