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
    "tests/jls/Splitter.jls",
    "Splitter",
    logger,
  );
});

function genTest(input: BitString) {
  return () => {
    const results = circuit.run({
      SplitterInput: input
    });

    expect(results.outputs.SplitterOutput.toString()).toBe(input.toString());
  }
}

let input = BitString.low(8);

while (true) {
  test(`Splitter: ${input}`, genTest(input));

  input = input.add('00000001');
  // Overflow
  if (input.toString() == '00000000') {
    break;
  }
}
