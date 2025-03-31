import { CircuitLoader } from "../CircuitLoader";
import { CircuitProject } from "../CircuitProject";
import { LogLevel } from "../CircuitLogger";
import { CircuitElement } from "../CircuitElement";
import { AndGate } from "../CircuitElement/AndGate";
import { CircuitBus } from "../CircuitBus";
import { XorGate } from "../CircuitElement/XorGate";
import { Input } from "../CircuitElement/Input";
import { Output } from "../CircuitElement/Output";
import { SubCircuit } from "../CircuitElement/SubCircuit";
import Stream from "stream";
import { FileUtil } from "../Util/File";
import { NotGate } from "../CircuitElement/NotGate";
import { OrGate } from "../CircuitElement/OrGate";
import { Splitter } from "../CircuitElement/Splitter";
import { Circuit } from "../Circuit";

type CircuitContext = {
  nodes: CircuitBus[];
  data: any;
  project: CircuitProject;
};

const createElement: Record<string, (ctx: CircuitContext) => CircuitElement> = {
  AndGate: ({ nodes, data }) =>
    new AndGate(
      data.customData.nodes.inp.map((i: number) => nodes[i]),
      [nodes[data.customData.nodes.output1]],
    ),
  XorGate: ({ nodes, data }) =>
    new XorGate(
      data.customData.nodes.inp.map((i: number) => nodes[i]),
      [nodes[data.customData.nodes.output1]],
    ),
  InputPin: ({ nodes, data }) =>
    new Input(data.index, data.label, [nodes[data.customData.nodes.output1]]),
  OutputPin: ({ nodes, data }) =>
    new Output(data.index, data.label, nodes[data.customData.nodes.inp1]),
  SubCircuit: ({ nodes, data, project }) =>
    new SubCircuit(
      project.getCircuitById(data.id),
      data.inputNodes.map((nodeInd: number) => nodes[nodeInd]),
      data.outputNodes.map((nodeInd: number) => nodes[nodeInd]),
    ),
  NotGate: ({ nodes, data }) =>
    new NotGate(
      data.customData.nodes.inp.map((i: number) => nodes[i]),
      [nodes[data.customData.nodes.output1]],
    ),
  OrGate: ({ nodes, data }) =>
    new OrGate(
      data.customData.nodes.inp.map((i: number) => nodes[i]),
      [nodes[data.customData.nodes.output1]],
    ),
  Splitter: ({ nodes, data }) =>
    new Splitter(
      // No, this is not a typo in our code, their data file actually has "constructorParamaters"
      // instead of the proper spelling "constructorParameters"...
      data.customData.constructorParamaters[2],
      nodes[data.customData.nodes.inp1],
      data.customData.nodes.outputs.map((nodeInd: number) => nodes[nodeInd]),
    ),
};

export class JLSCircuitLoader extends CircuitLoader {
  constructor() {
    super("JLSCircuitLoader");
  }

  async load(stream: Stream): Promise<CircuitProject> {
    const project: CircuitProject = new CircuitProject();
    this.propagateLoggersTo(project);

    const data = await FileUtil.extractFromZip(stream, ["JLSCircuit"]).then(
      ([stream]) => FileUtil.readTextStream(stream),
    );

    this.log(LogLevel.INFO, `Loading circuit from data ${data}`);

    // Get all circuit parts
    const lines: string[] = data.split("\n");

    // Blacklist elements without nodes or that are visual only
    const blacklistKeys = ["WireEnd", "Text"];

    let circuitStack: string[] = [];
    let circuitMap: Record<string, any> = {};

    // Generate a list of all of the different types of circuits
    for (let line of lines) {
      const lineParts = line.replace(/[\n\r]+/g, "").split(" ");

      if (line.startsWith("CIRCUIT")) {
        circuitStack.push(lineParts[1]);
        circuitMap[lineParts[1]] = [];
      } else if (
        line.startsWith("ELEMENT") &&
        !blacklistKeys.includes(lineParts[1])
      ) {
        circuitMap[circuitStack[circuitStack.length - 1]].push(lineParts[1]);
      } else if (line.startsWith("ENDCIRCUIT")) {
        if (circuitStack.length > 0) {
          circuitStack.pop();
        }
      }
    }

    let arbitraryIdx: number = 0;
    // Iterate for every circuit
    for (const circuitName of Object.keys(circuitMap)) {
      const circuitElements: CircuitElement[] = [];

      // Iterate for every element in the circuit map
      for (const elementType of circuitMap[circuitName]) {
        // Establish data for element
        const data = {
          customData: {
            nodes: { output1: 0 },
            values: [],
          },
          index: arbitraryIdx,
        };

        // TODO: Build nodes and data
        const newElement = createElement[elementType]({
          project: project,
          nodes: [],
          data: data,
        });
        circuitElements.push(newElement);
      }

      const circuit = new Circuit(
        arbitraryIdx.toString(),
        circuitName,
        circuitElements,
      );
      project.addCircuit(circuit);
    }

    console.log(circuitMap);

    return project;
  }
}
