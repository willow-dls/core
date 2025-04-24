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

let circuit;

beforeAll(async () => {
  const project = await loadProject(
    CircuitVerseLoader,
    "tests/cv/SimpleInputs.cv",
  );
  circuit = project.getCircuitByName("Main");
});

test("Power Input", async () => {
  const result = circuit.resolve();
  expect(result.outputs.PowerOutput.toString()).toBe("1");
});

test("Ground Input", async () => {
  const result = circuit.resolve();
  expect(result.outputs.GroundOutput.toString()).toBe("0");
});

test("Constant Input", async () => {
  const result = circuit.resolve();
  expect(result.outputs.ConstantOutput.toString()).toBe("1011");
});

test("Button Input", async () => {
  let result = circuit.run({
    Button1: "0",
    Button2: "1",
  });

  expect(result.outputs.Button1Output.toString()).toBe("0");
  expect(result.outputs.Button2Output.toString()).toBe("1");

  result = circuit.run({
    Button1: "1",
    Button2: "0",
  });

  expect(result.outputs.Button1Output.toString()).toBe("1");
  expect(result.outputs.Button2Output.toString()).toBe("0");
});
