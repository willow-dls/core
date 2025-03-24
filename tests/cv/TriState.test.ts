import {expect, beforeAll, test} from '@jest/globals';

import { BitString } from "../../src/BitString";
import { loadProject } from "../../src/CircuitLoader";
import { CircuitVerseLoader } from "../../src/CircuitLoader/CircuitVerseLoader";

// const logger = new FileLogger('tristate.log');
let circuit;

beforeAll(async () => {
  //const logger = new ConsoleLogger();
  // logger.setLevel(LogLevel.TRACE).setSubsystems(/^Circuit$/, /^TriStateElement$/, /^OutputElement$/);

  const project = await loadProject(CircuitVerseLoader, "tests/cv/TriState.cv");
  circuit = project.getCircuitByName("Main");

  //adder = null;
});

// afterAll(async() => {
//     await logger.close();
// });

const table = [
  ["0", "0", null],
  ["0", "1", "0"],
  ["1", "0", null],
  ["1", "1", "1"],
];

for (const entry of table) {
  const inputs = {
    Input: entry[0] ? new BitString(entry[0]) : null,
    Enable: entry[1] ? new BitString(entry[1]) : null,
  };

  const outputs = {
    Output: entry[2] != null ? new BitString(entry[2]) : null,
  };

  test(`[Input = ${inputs.Input}, Enable = ${inputs.Enable}] => [Output = ${outputs.Output}]`, () => {
    const results = circuit.run(inputs);
    expect(results.outputs).toStrictEqual(outputs);
  });
}
