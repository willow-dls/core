import {expect, beforeAll, test} from '@jest/globals';

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
