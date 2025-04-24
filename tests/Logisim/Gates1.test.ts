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

let andCircuit;
let and2Circuit;
let orCircuit;
let xorCircuit;

// test("Load Logisim file by name", async () => {
//     const project = await loadProject(LogisimLoader, "tests/Logisim/AndGate.circ");
//     expect(project).not.toBe(null);
// });

beforeAll(async () => {
  // logger.setLevel(LogLevel.TRACE).setSubsystems(/^Circuit$/);
  const project = await loadProject(LogisimLoader, "tests/Logisim/Gates1.circ");
  andCircuit = project.getCircuitByName("main");
  orCircuit = project.getCircuitByName("ORGate");
  and2Circuit = project.getCircuitByName("AndGate2");
  xorCircuit = project.getCircuitByName("XORGate");
});

const andtable = [
  //I1 I2 O1
  "000",
  "100",
  "010",
  "111",
];

const and2table = [
  //I1 I2 O1
  "001",
  "101",
  "011",
  "110",
];

const ortable = [
  //I1 I2 O1
  "000",
  "101",
  "011",
  "111",
];

const xortable = [
  //I1 I2 O1
  "000",
  "101",
  "011",
  "110",
];

for (const entry of andtable) {
  test("And Gate-1", async () => {
    const inputs = {
      Input1: new BitString(entry[0]),
      Input2: new BitString(entry[1]),
    };
    const outputs = {
      Output1: new BitString(entry[2]),
    };
    const results = andCircuit.run(inputs);
    expect(results.outputs.Output1.toString()).toStrictEqual(
      outputs.Output1.toString(),
    );
  });
}
for (const entry of and2table) {
  test.failing("Bad And Gate", async () => {
    const inputs = {
      Input1: new BitString(entry[0]),
      Input2: new BitString(entry[1]),
    };
    const outputs = {
      Output1: new BitString(entry[2]),
    };
    const results = andCircuit.run(inputs);

    // console.log(
    //     `Inputs = ${JSON.stringify(inputs)}\n
    //     Outputs = ${JSON.stringify(outputs)}\n
    //     Results = ${JSON.stringify(results.outputs)}`)

    expect(results.outputs.Output1.toString()).toStrictEqual(
      outputs.Output1.toString(),
    );
  });
}

for (const entry of ortable) {
  test("OR Gate", async () => {
    const inputs = {
      Input1: new BitString(entry[0]),
      Input2: new BitString(entry[1]),
    };
    const outputs = {
      Output1: new BitString(entry[2]),
    };
    const results = orCircuit.run(inputs);
    expect(results.outputs.Output1.toString()).toStrictEqual(
      outputs.Output1.toString(),
    );
  });
}

for (const entry of andtable) {
  test("And Gate-2", async () => {
    const inputs = {
      Input1: new BitString(entry[0]),
      Input2: new BitString(entry[1]),
    };
    const outputs = {
      Output1: new BitString(entry[2]),
    };
    const results = and2Circuit.run(inputs);
    expect(results.outputs.Output1.toString()).toStrictEqual(
      outputs.Output1.toString(),
    );
  });
}

for (const entry of xortable) {
  test("XOR Gate", async () => {
    const inputs = {
      Input1: new BitString(entry[0]),
      Input2: new BitString(entry[1]),
    };
    const outputs = {
      Output1: new BitString(entry[2]),
    };

    const results = xorCircuit.run(inputs);
    expect(results.outputs.Output1.toString()).toStrictEqual(
      outputs.Output1.toString(),
    );
  });
}
