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
  WireEnd: ({ nodes, data }) =>
    new OrGate(
      data.customData.nodes.inp.map((i: number) => nodes[i]),
      [nodes[data.customData.nodes.output1]],
    ),
};

export class JLSCircuitLoader extends CircuitLoader {
  constructor() {
    super("JLSCircuitLoader");
  }

  parseCircuit(tokens: string[]): Circuit {
    const tokenToParse = tokens.shift();
    const name = tokens.shift();

    if (tokenToParse != "CIRCUIT") {
      this.log(LogLevel.INFO, `Failed to parse ${tokenToParse}`);
      throw new Error("I should be parsing a CIRCUIT");
    }

    const elements: CircuitElement[] = [];
    while (tokens.length > 0) {
      const nextToken = tokens[0];
      if (nextToken == "ENDCIRCUIT") {
        tokens.shift();
        break;
      }
      elements.push(this.parseElement(tokens));
    }

    return new Circuit(name ?? "", name ?? "", elements);
  }

  parseElement(tokens: string[]): CircuitElement {
    let tokenToParse = tokens.shift();

    if (tokenToParse != "ELEMENT") {
      this.log(
        LogLevel.ERROR,
        `Should be parsing ELEMENT, found ${tokenToParse}`,
      );
      throw new Error("I should be parsing an ELEMENT");
    }

    const elementType = tokens.shift();
    if (elementType != undefined && !(elementType in createElement)) {
      throw new Error(`${elementType} is not a valid ELEMENT`);
    }

    this.log(LogLevel.INFO, `Parsing element ${elementType}`);
    if (elementType == undefined) {
      throw new Error("Something went wrong");
    }

    while (tokens.length > 0) {
      tokenToParse = tokens.shift();
      if (tokenToParse === "END") {
        break;
      }
    }

    return createElement[elementType]?.({
      nodes: [],
      data: {},
      project: {} as CircuitProject,
    });
  }

  async load(stream: Stream): Promise<CircuitProject> {
    const project: CircuitProject = new CircuitProject();
    this.propagateLoggersTo(project);

    const data = await FileUtil.extractFromZip(stream, ["JLSCircuit"]).then(
      ([stream]) => FileUtil.readTextStream(stream),
    );

    // Get all circuit parts
    const tokens: string[] = data
      .split(/[\s+]/)
      .filter((token) => token.length > 0);

    this.log(LogLevel.WARN, `${tokens}`);

    this.log(LogLevel.INFO, `Loading circuit from data ${tokens[1]}`);

    const circuitList: Circuit[] = [];
    while (tokens.length > 0) {
      this.log(LogLevel.INFO, `Parsing circuit with ${tokens.length} tokens`);
      const circuit: Circuit = this.parseCircuit(tokens);
      circuitList.push(circuit);
    }

    // Blacklist elements without nodes or that are visual only
    const blacklistKeys = ["Text"];

    return project;
  }
}
