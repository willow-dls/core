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
