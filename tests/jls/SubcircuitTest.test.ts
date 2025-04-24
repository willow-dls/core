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
import { BitString, Circuit, loadCircuit } from "../../src";
import { JLSLoader } from "../../src/CircuitLoader/JLSLoader";
import { FileLogger } from "../../src/CircuitLogger/FileLogger";
import { LogLevel } from "../../src/CircuitLogger";

let circuit: Circuit;

beforeAll(async () => {
  const logger = new FileLogger("jls.log");
  logger.setLevel(LogLevel.TRACE);

  circuit = await loadCircuit(
    JLSLoader,
    "tests/jls/SubcircuitTest.jls",
    "EightBitAdder",
    logger,
  );
});

test("JLS Eight Bit Adder Subcircuit test", () => {
  //  This test implicitly requires that the 8 bit adder is correct,
  // but really it's just testing that all the subcircuit indices line
  // up properly.
  const results = circuit.run({
    A0: "0",
    A1: "0",
    A2: "0",
    A3: "0",
    A4: "0",
    A5: "1",
    A6: "0",
    A7: "1",

    B0: "1",
    B1: "0",
    B2: "0",
    B3: "0",
    B4: "0",
    B5: "1",
    B6: "0",
    B7: "0",
  });

  const expectedOutputs = {
    Sum0: "1",
    Sum1: "0",
    Sum2: "0",
    Sum3: "0",
    Sum4: "0",
    Sum5: "0",
    Sum6: "1",
    Sum7: "1",
    Carry: "0",
  };

  const actualOutputs = { ...results.outputs };
  Object.keys(actualOutputs).forEach((k) => {
    actualOutputs[k] = actualOutputs[k].toString();
  });

  expect(actualOutputs).toStrictEqual(expectedOutputs);
});
