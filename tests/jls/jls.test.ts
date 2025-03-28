import { beforeAll } from "@jest/globals";
import { Circuit, loadProject } from "../../src";
import { JLSCircuitLoader } from "../../src/CircuitLoader/JLSLoader";

let bitSelector: Circuit;

beforeAll(async () => {
  const project = await loadProject(
    JLSCircuitLoader,
    "tests/jls/SubcircuitTest",
  );
  // bitSelector = project.getCircuitByName("BitSelector");
});

test("Sample", async () => {});
