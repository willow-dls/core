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

let muxCircuit;
let demuxCircuit;
let decodCircuit;
let encodCircuit;
let bitSelCircuit;

beforeAll(async () => {
  const project = await loadProject(LogisimLoader, "tests/Logisim/Plexers.circ");
  muxCircuit = project.getCircuitByName("mux");
  demuxCircuit = project.getCircuitByName("demux");
  decodCircuit = project.getCircuitByName("decod");
  encodCircuit = project.getCircuitByName("encod");
  bitSelCircuit = project.getCircuitByName("bselect");
});

const muxtable = [
  //I1 I2 S1 01
  "0000",
  "0010",
  "1010",
  "0111",
  "0100",
  "1101",
  "1111",
];

const demuxtable = [
  //I1 S1 O1 O2
  "0000",
  "1010",
  "0100",
  "1101",
];

const decodtable1 = [
  //S1 O1 O2
  "010",
  "101",
];

const decodtable2 = [
  //S1 O1 O2
  "000",
  "111",
  "001",
  "110",
];

const encodtable = [
  //S1 O1 O2
  "000",
  "111",
  "001",
  "110",
];




for (const entry of muxtable) {
  test("Multiplexer", async () => {
    const inputs = {
      Input1: new BitString(entry[0]),
      Input2: new BitString(entry[1]),
      Control: new BitString(entry[2])
    };
    const outputs = {
      Output1: new BitString(entry[3]),
    };
    const results = muxCircuit.run(inputs);
    expect(results.outputs.Output1.toString()).toStrictEqual(outputs.Output1.toString());
  });
}

for (const entry of demuxtable) {
  test("Demultiplexer", async () => {
    const inputs = {
      Input1: new BitString(entry[0]),
      Control: new BitString(entry[1]),
    };
    const outputs = {
      Output1: new BitString(entry[2]),
      Output2: new BitString(entry[3]),
    };
    const results = demuxCircuit.run(inputs);
    expect(results.outputs.Output1.toString()).toStrictEqual(outputs.Output1.toString());
    expect(results.outputs.Output2.toString()).toStrictEqual(outputs.Output2.toString());
  });
}

for (const entry of decodtable1) {
  test("Decoder 1", async () => {
    const inputs = {
      Select: new BitString(entry[0]),
    };
    const outputs = {
      Output1: new BitString(entry[1]),
      Output2: new BitString(entry[2]),
    };
    const results = decodCircuit.run(inputs);
    expect(results.outputs.Output1.toString()).toStrictEqual(outputs.Output1.toString());
    expect(results.outputs.Output2.toString()).toStrictEqual(outputs.Output2.toString());
  });
}

for (const entry of decodtable2) {
  test.failing("Decoder 2", async () => {
    const inputs = {
      Select: new BitString(entry[0]),
    };
    const outputs = {
      Output1: new BitString(entry[1]),
      Output2: new BitString(entry[2]),
    };
    const results = decodCircuit.run(inputs);
    expect(results.outputs.Output1.toString()).toStrictEqual(outputs.Output1.toString());
    expect(results.outputs.Output2.toString()).toStrictEqual(outputs.Output2.toString());
  });
}


test("bitSelector 1", async () => {
  const inputs = {
    Input1: new BitString("0001"),
    Select: new BitString("00"),
  };
  const results = bitSelCircuit.run(inputs);
  expect(results.outputs.Output1.toString()).toStrictEqual("1");

});

test("bitSelector 2", async () => {
  const inputs = {
    Input1: "0001",
    Select: "01",
  };
  const results = bitSelCircuit.run(inputs);
  expect(results.outputs.Output1.toString()).toStrictEqual("0");

});

test("Should return 1", () => {
  const inputs = {
    Input1: "1000",
    Selector: "11",
  };

  const results = bitSelCircuit.run(inputs);

  expect(results.outputs.Output.toString()).toStrictEqual("1");
});
