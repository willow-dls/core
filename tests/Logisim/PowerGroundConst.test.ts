import { expect, beforeAll, test } from "@jest/globals";
import { BitString } from "../../src/BitString";
import { loadProject } from "../../src/CircuitLoader";
import { LogisimLoader } from "../../src/CircuitLoader/LogisimLoader";
import { FileLogger } from "../../src/CircuitLogger/FileLogger";
import { LogLevel } from "../../src/CircuitLogger";

let circ;
const logger = new FileLogger("pow.log");
// test("Load Logisim file by name", async () => {
//     const project = await loadProject(LogisimLoader, "tests/Logisim/AndGate.circ");
//     expect(project).not.toBe(null);
// });

beforeAll(async () => {
  logger.setLevel(LogLevel.TRACE);
  const project = await loadProject(
    LogisimLoader,
    "tests/Logisim/PowerGroundConst.circ",
  );
  circ = project.getCircuitByName("main");
  logger.attachTo(circ);
});

afterAll(async () => {
  logger.close();
});

test("Power", async () => {
  const outputs = {
    Output1: new BitString("1"),
  };
  const results = circ.run();
  expect(results.outputs.Output1.toString()).toStrictEqual(
    outputs.Output1.toString(),
  );
});

test("Ground", async () => {
  const outputs = {
    Output2: new BitString("0"),
  };
  const results = circ.run();
  expect(results.outputs.Output2.toString()).toStrictEqual(
    outputs.Output2.toString(),
  );
});

test("Power not", async () => {
  const outputs = {
    Output3: new BitString("0"),
  };
  const results = circ.run();
  expect(results.outputs.Output3.toString()).toStrictEqual(
    outputs.Output3.toString(),
  );
});

test("Ground not", async () => {
  const outputs = {
    Output4: new BitString("1"),
  };
  const results = circ.run();
  expect(results.outputs.Output4.toString()).toStrictEqual(
    outputs.Output4.toString(),
  );
});

test("Constant 0", async () => {
  const outputs = {
    Output5: new BitString("0"),
  };
  const results = circ.run();
  expect(results.outputs.Output5.toString()).toStrictEqual(
    outputs.Output5.toString(),
  );
});

test("Constant 1 Not", async () => {
  const outputs = {
    Output6: new BitString("0"),
  };
  const results = circ.run();
  expect(results.outputs.Output6.toString()).toStrictEqual(
    outputs.Output6.toString(),
  );
});
