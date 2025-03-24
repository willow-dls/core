import { loadProject } from "../../src/CircuitLoader";

import { CircuitVerseLoader } from "../../src/CircuitLoader/CircuitVerseLoader";

let circuit;

beforeAll(async () => {
  const project = await loadProject(
    CircuitVerseLoader,
    "tests/cv/SimpleInputs.cv",
  );
  circuit = project.getCircuitByName("Main");
});

test("Power Input", async () => {
  const result = circuit.resolve();
  expect(result.outputs.PowerOutput.toString()).toBe("1");
});

test("Ground Input", async () => {
  const result = circuit.resolve();
  expect(result.outputs.GroundOutput.toString()).toBe("0");
});

test("Constant Input", async () => {
  const result = circuit.resolve();
  expect(result.outputs.ConstantOutput.toString()).toBe("1011");
});

test("Button Input", async () => {
  let result = circuit.run({
    Button1: "0",
    Button2: "1",
  });

  expect(result.outputs.Button1Output.toString()).toBe("0");
  expect(result.outputs.Button2Output.toString()).toBe("1");

  result = circuit.run({
    Button1: "1",
    Button2: "0",
  });

  expect(result.outputs.Button1Output.toString()).toBe("1");
  expect(result.outputs.Button2Output.toString()).toBe("0");
});
