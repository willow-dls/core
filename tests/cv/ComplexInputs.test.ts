import { expect, beforeAll, test } from "@jest/globals";

import { BitString } from "../../src/BitString";
import { loadProject } from "../../src/CircuitLoader";

import { CircuitVerseLoader } from "../../src/CircuitLoader/CircuitVerseLoader";

let circuit;

beforeAll(async () => {
  // const logger = new FileLogger('complex-inputs.log');
  // logger.setLevel(LogLevel.TRACE);
  // logger.setSubsystems(/^Circuit$/, /^CounterElement$/);
  const project = await loadProject(
    CircuitVerseLoader,
    "tests/cv/ComplexInputs.cv",
  );
  circuit = project.getCircuitByName("Main");
});

test(`'0001'.greaterThan('0011')`, () => {
  const b1 = new BitString("0001");
  const b2 = new BitString("0011");

  expect(b1.greaterThan(b2)).toBe(false);
});

test(`Count clock cycles 1`, async () => {
  const result = circuit.run(
    {
      MaxValue: "0011",
    },
    (high, cycles) => !high && cycles == 1,
  );

  const countOut = result.outputs.CounterOutput.toString();
  const countZero = result.outputs.CounterZero.toString();

  expect(countOut).toBe("0001");
  expect(countZero).toBe("0");
});

test(`Count clock cycles 2`, async () => {
  const result = circuit.run(
    {
      MaxValue: "0011",
    },
    (high, cycles) => !high && cycles == 2,
  );

  const countOut = result.outputs.CounterOutput.toString();
  const countZero = result.outputs.CounterZero.toString();

  expect(countOut).toBe("0010");
  expect(countZero).toBe("0");
});

test(`Count clock cycles 3`, async () => {
  const result = circuit.run(
    {
      MaxValue: "0011",
    },
    (high, cycles) => !high && cycles == 3,
  );

  const countOut = result.outputs.CounterOutput.toString();
  const countZero = result.outputs.CounterZero.toString();

  expect(countOut).toBe("0011");
  expect(countZero).toBe("0");
});

test(`Count clock cycles 4`, async () => {
  const result = circuit.run(
    {
      MaxValue: "0011",
    },
    (high, cycles) => !high && cycles == 4,
  );

  const countOut = result.outputs.CounterOutput.toString();
  const countZero = result.outputs.CounterZero.toString();

  expect(countOut).toBe("0000");
  expect(countZero).toBe("1");
});

test(`Count clock cycles 5`, async () => {
  const result = circuit.run(
    {
      MaxValue: "0011",
    },
    (high, cycles) => !high && cycles == 5,
  );

  const countOut = result.outputs.CounterOutput.toString();
  const countZero = result.outputs.CounterZero.toString();

  expect(countOut).toBe("0001");
  expect(countZero).toBe("0");
});
