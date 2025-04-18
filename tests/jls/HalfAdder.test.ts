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
    "tests/jls/HalfAdder.jls",
    "HalfAdder",
    logger,
  );
});

const truthTable = [
  ["00", "00"],
  ["01", "10"],
  ["10", "10"],
  ["11", "01"],
];

function genTest(inputs, outputs) {
  return () => {
    const actualOutputs = circuit.run(inputs).outputs;
    expect(actualOutputs.Sum.toString()).toStrictEqual(outputs.Sum);
    expect(actualOutputs.Carry.toString()).toStrictEqual(outputs.Carry);
  };
}

for (const row of truthTable) {
  const inputs = {
    InputA: row[0][0],
    InputB: row[0][1],
  };

  const outputs = {
    Sum: row[1][0],
    Carry: row[1][1],
  };

  test(
    `JLS Half Adder [A = ${inputs.InputA}, B = ${inputs.InputB}] => [Sum = ${outputs.Sum}, Carry = ${outputs.Carry}]`,
    genTest(inputs, outputs),
  );
}
