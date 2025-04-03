import { beforeAll } from "@jest/globals";
import { Circuit, loadProject } from "../../src";
import { JLSCircuitLoader } from "../../src/CircuitLoader/JLSLoader";
import { FileLogger } from "../../src/CircuitLogger/FileLogger";
import { LogLevel } from "../../src/CircuitLogger";

let bitSelector: Circuit;

beforeAll(async () => {
  const logger = new FileLogger("jls.log");
  logger.setLevel(LogLevel.TRACE);

  const project = await loadProject(
    JLSCircuitLoader,
    "tests/jls/HalfAdder.jls",
    logger,
  );
  // bitSelector = project.getCircuitByName("BitSelector");
});

test("Sample", async () => {});
