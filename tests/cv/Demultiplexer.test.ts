import { loadProject } from "../../src/CircuitLoader";
import { CircuitVerseLoader } from "../../src/CircuitLoader/CircuitVerseLoader";
import { BitString } from "../../src/BitString";
import { Circuit } from "../../src/Circuit";

let multiplexer: Circuit;

beforeAll(async () => {
  const project = await loadProject(
    CircuitVerseLoader,
    "tests/cv/Demultiplexer.cv",
  );
  multiplexer = project.getCircuitByName("Demultiplexer");
});

test("Expect First Input", () => {
  const inputs = {
    InputA: new BitString("1000", 4),
    Signal: new BitString("0", 1),
  };

  const results = multiplexer.run(inputs);

  expect(results.outputs.OutputA.toString()).toStrictEqual("1000");
  expect(results.outputs.OutputB.toString()).toStrictEqual("0000");
});

test("Expect Second Input", () => {
  const inputs = {
    InputA: new BitString("1000", 4),
    Signal: new BitString("1", 1),
  };

  const results = multiplexer.run(inputs);

  expect(results.outputs.OutputA.toString()).toStrictEqual("0000");
  expect(results.outputs.OutputB.toString()).toStrictEqual("1000");
});
