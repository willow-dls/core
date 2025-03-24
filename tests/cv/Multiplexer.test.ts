import { BitString } from "../../src/BitString";
import { Circuit } from "../../src/Circuit";
import { loadProject } from "../../src/CircuitLoader";
import { CircuitVerseLoader } from "../../src/CircuitLoader/CircuitVerseLoader";

let multiplexer: Circuit;

beforeAll(async () => {
  const project = await loadProject(
    CircuitVerseLoader,
    "tests/cv/Multiplexer.cv",
  );
  multiplexer = project.getCircuitByName("Multiplexer");
});

test("Expect First Input", () => {
  const inputs = {
    InputA: new BitString("1", 1),
    InputB: new BitString("0", 1),
    Signal: new BitString("0", 1),
  };

  const results = multiplexer.run(inputs);

  expect(results.outputs.OutputA.toString()).toStrictEqual("1");
});

test("Expect Second Input", () => {
  const inputs = {
    InputA: new BitString("1", 1),
    InputB: new BitString("0", 1),
    Signal: new BitString("1", 1),
  };

  const results = multiplexer.run(inputs);

  expect(results.outputs.OutputA.toString()).toStrictEqual("0");
});
