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

test('JLS Eight Bit Adder Subcircuit test', () => {
  //  This test implicitly requires that the 8 bit adder is correct,
  // but really it's just testing that all the subcircuit indices line
  // up properly.
  const results = circuit.run({
    A0: '0',
    A1: '0',
    A2: '0',
    A3: '0',
    A4: '0',
    A5: '1',
    A6: '0',
    A7: '1',

    B0: '1',
    B1: '0',
    B2: '0',
    B3: '0',
    B4: '0',
    B5: '1',
    B6: '0',
    B7: '0',
  });

  const expectedOutputs = {
    Sum0: '1',
    Sum1: '0',
    Sum2: '0',
    Sum3: '0',
    Sum4: '0',
    Sum5: '0',
    Sum6: '1',
    Sum7: '1',
    Carry: '0'
  };

  const actualOutputs = {...results.outputs};
  Object.keys(actualOutputs).forEach((k) => {
    actualOutputs[k] = actualOutputs[k].toString();
  });

  expect(actualOutputs).toStrictEqual(expectedOutputs);
});