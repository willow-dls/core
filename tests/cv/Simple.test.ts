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

// let logger = new FileLogger('simple.log');
let project;

beforeAll(async () => {
  // logger.setLevel(LogLevel.TRACE).setSubsystems(/^Circuit$/);
  project = await loadProject(CircuitVerseLoader, "tests/cv/Simple.cv");
});

test("Simple Combinatorial 1", async () => {
  const circuit = project.getCircuitByName("Combinatorial");

  const output = circuit.run({
    inp1: "0",
    inp2: "0",
  });

  expect(output.outputs.out1.toString()).toBe("0");
});

test("Simple Combinatorial 2", async () => {
  const circuit = project.getCircuitByName("Combinatorial");

  const output = circuit.run({
    inp1: "0",
    inp2: "1",
  });

  expect(output.outputs.out1.toString()).toBe("0");
});

test("Simple Combinatorial 3", async () => {
  const circuit = project.getCircuitByName("Combinatorial");

  const output = circuit.run({
    inp1: "1",
    inp2: "0",
  });

  expect(output.outputs.out1.toString()).toBe("0");
});

test("Simple Combinatorial 4", async () => {
  const circuit = project.getCircuitByName("Combinatorial");

  const output = circuit.run({
    inp1: "1",
    inp2: "1",
  });

  expect(output.outputs.out1.toString()).toBe("1");
});

test("Simple Sequential 1", async () => {
  const circuit = project.getCircuitByName("Sequential");

  const outputs = circuit.run({
    Reset: "0",
    Set: "1",
  }).outputs;

  expect(outputs.Q.toString()).toBe("1");
  expect(outputs.NotQ.toString()).toBe("0");
});

test("Simple Sequential 2", async () => {
  const circuit = project.getCircuitByName("Sequential");

  const outputs = circuit.run({
    Reset: "1",
    Set: "0",
  }).outputs;

  expect(outputs.Q.toString()).toBe("0");
  expect(outputs.NotQ.toString()).toBe("1");
});

test("Simple Sequential 3", async () => {
  const circuit = project.getCircuitByName("Sequential");

  const outputs = circuit.run({
    Reset: "1",
    Set: "0",
  }).outputs;

  expect(outputs.Q.toString()).toBe("0");
  expect(outputs.NotQ.toString()).toBe("1");
});

test("Simple Sequential 4", async () => {
  const circuit = project.getCircuitByName("Sequential");

  const outputs = circuit.run({
    Reset: "1",
    Set: "1",
  }).outputs;

  expect(outputs.Q.toString()).toBe("0");
  expect(outputs.NotQ.toString()).toBe("0");
});

test("Simple Sequential 5", async () => {
  const circuit = project.getCircuitByName("Sequential");

  const outputs = circuit.run({
    Reset: "0",
    Set: "0",
    Q: "1",
  }).outputs;

  expect(outputs.Q.toString()).toBe("1");
  expect(outputs.NotQ.toString()).toBe("0");
});

test("Simple Subcircuit 1", async () => {
  const circuit = project.getCircuitByName("Subcircuit");

  let outputs = circuit.run({
    inp1: "1",
    inp2: "0",
  }).outputs;

  expect(outputs.out1.toString()).toBe("1");
});

test("Simple Subcircuit 2", async () => {
  const circuit = project.getCircuitByName("Subcircuit");

  let outputs = circuit.run({
    inp1: "0",
    inp2: "1",
  }).outputs;

  expect(outputs.out1.toString()).toBe("0");
});

test("Simple Subcircuit 3", async () => {
  const circuit = project.getCircuitByName("Subcircuit");

  let outputs = circuit.run({
    inp1: "1",
    inp2: "1",
  }).outputs;

  expect(outputs.out1.toString()).toBe("0");
});

test("Simple Subcircuit 4", async () => {
  const circuit = project.getCircuitByName("Subcircuit");

  let outputs = circuit.run({
    inp1: "0",
    inp2: "0",
  }).outputs;

  expect(outputs.out1.toString()).toBe("0");
});
