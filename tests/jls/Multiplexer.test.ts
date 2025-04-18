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
    "tests/jls/Multiplexer.jls",
    "Multiplexer",
    logger,
  );
});

test("Just needs to load", () => {});
