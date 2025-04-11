import { expect, beforeAll, test } from "@jest/globals";

import { loadProject } from "../../src/CircuitLoader";
import { LogisimLoader } from "../../src/CircuitLoader/LogisimLoader";

// let logger = new FileLogger('simple.log');
let project;


test("Load Logisim file by name", async () => {
    const project = await loadProject(LogisimLoader, "tests/Logisim/Gates_Simple.circ");
    expect(project).not.toBe(null);
});