import { Circuit } from "../Circuit";
import { CircuitElement } from "../CircuitElement";
import { AndGate } from "../CircuitElement/AndGate";
import { Input } from "../CircuitElement/Input";
import { NorGate } from "../CircuitElement/NorGate";
import { Output } from "../CircuitElement/Output";
import { SubCircuit } from "../CircuitElement/SubCircuit";
import { CircuitLoader } from "../CircuitLoader";
import { CircuitBus } from "../CircuitBus";
import { CircuitProject } from "../CircuitProject";
import { NandGate } from "../CircuitElement/NandGate";
import { NotGate } from "../CircuitElement/NotGate";
import { XnorGate } from "../CircuitElement/XnorGate";
import { XorGate } from "../CircuitElement/XorGate";
import { LogLevel } from "../CircuitLogger";
import { Splitter } from "../CircuitElement/Splitter";
import { Power } from "../CircuitElement/Power";
import { Ground } from "../CircuitElement/Ground";
import { Constant } from "../CircuitElement/Constant";
import { BitString } from "../BitString";
import { Random } from "../CircuitElement/Random";
import { Counter } from "../CircuitElement/Counter";
import { Clock } from "../CircuitElement/Clock";
import { TriState } from "../CircuitElement/TriState";
import { OrGate } from "../CircuitElement/OrGate";
import { Demultiplexer } from "../CircuitElement/Demultiplexer";
import { Multiplexer } from "../CircuitElement/Multiplexer";
import { LSB } from "../CircuitElement/LSB";
import { BitSelector } from "../CircuitElement/BitSelector";
import { MSB } from "../CircuitElement/MSB";
import { PriorityEncoder } from "../CircuitElement/PriorityEncoder";
import { Decoder } from "../CircuitElement/Decoder";

type CircuitContext = {
  nodes: CircuitBus[];
  data: any;
  project: CircuitProject;
};

// TODO: Consistent formatting of the keys on this object.
const createElement: Record<string, (ctx: CircuitContext) => CircuitElement> = {
  AndGate: ({ nodes, data }) =>
    new AndGate(
      data.customData.nodes.inp.map((i: number) => nodes[i]),
      [nodes[data.customData.nodes.output1]],
    ),
  NorGate: ({ nodes, data }) =>
    new NorGate(
      data.customData.nodes.inp.map((i: number) => nodes[i]),
      [nodes[data.customData.nodes.output1]],
    ),
  NandGate: ({ nodes, data }) =>
    new NandGate(
      data.customData.nodes.inp.map((i: number) => nodes[i]),
      [nodes[data.customData.nodes.output1]],
    ),
  OrGate: ({ nodes, data }) =>
    new OrGate(
      data.customData.nodes.inp.map((i: number) => nodes[i]),
      [nodes[data.customData.nodes.output1]],
    ),
  NotGate: ({ nodes, data }) =>
    new NotGate(
      [nodes[data.customData.nodes.inp1]],
      [nodes[data.customData.nodes.output1]],
    ),
  XnorGate: ({ nodes, data }) =>
    new XnorGate(
      data.customData.nodes.inp.map((i: number) => nodes[i]),
      [nodes[data.customData.nodes.output1]],
    ),
  XorGate: ({ nodes, data }) =>
    new XorGate(
      data.customData.nodes.inp.map((i: number) => nodes[i]),
      [nodes[data.customData.nodes.output1]],
    ),
  Demultiplexer: ({ nodes, data }) =>
    new Demultiplexer(
      [nodes[data.customData.nodes.input]],
      data.customData.nodes.output1.map((i: number) => nodes[i]),
      nodes[data.customData.nodes.controlSignalInput],
    ),
  Multiplexer: ({ nodes, data }) => 
    new Multiplexer(
      data.customData.nodes.inp.map((i: number) => nodes[i]),
      [nodes[data.customData.nodes.output1]],
      nodes[data.customData.nodes.controlSignalInput]
    ),
  LSB: ({ nodes, data }) => new LSB(
    nodes[data.customData.nodes.inp1],
    nodes[data.customData.nodes.output1],
    nodes[data.customData.nodes.enable],
  ),
  MSB: ({ nodes, data }) => new MSB(
    nodes[data.customData.nodes.inp1],
    nodes[data.customData.nodes.output1],
    nodes[data.customData.nodes.enable],
  ),
  'PriorityEncoder': ({ nodes, data }) => new PriorityEncoder(
    data.customData.nodes.inp1.map((i: number) => nodes[i]),
    data.customData.nodes.output1.map((i: number) => nodes[i]),
    nodes[data.customData.nodes.enable],
  ),
  'Decoder': ({ nodes, data }) => new Decoder(
    data.customData.nodes.input.map((i: number) => nodes[i]),
    data.customData.nodes.output1.map((i: number) => nodes[i]),
  ),
  'Input': ({ nodes, data }) => new Input(
    data.index,
    data.label,
    [nodes[data.customData.nodes.output1]]
  ),
  // Treat a button just like a regular input.
  'Button': ({ nodes, data }) => new Input(
    data.index,
    data.label,
    [nodes[data.customData.nodes.output1]]
  ),
  // Treat a stepper just like a regular input.
  'Stepper': ({ nodes, data }) => new Input(
    data.index,
    data.label,
    [nodes[data.customData.nodes.output1]]
  ),
  'Output': ({ nodes, data }) => new Output(
    data.index,
    data.label,
    nodes[data.customData.nodes.inp1]
  ),
  'SubCircuit': ({ nodes, data, project }) => new SubCircuit(
    project.getCircuitById(data.id),
    data.inputNodes.map((nodeInd: number) => nodes[nodeInd]),
    data.outputNodes.map((nodeInd: number) => nodes[nodeInd])
  ),
  'Splitter': ({ nodes, data }) => new Splitter(
    // No, this is not a typo in our code, their data file actually has "constructorParamaters"
    // instead of the proper spelling "constructorParameters"...
    data.customData.constructorParamaters[2],
    nodes[data.customData.nodes.inp1],
    data.customData.nodes.outputs.map((nodeInd: number) => nodes[nodeInd])
  ),
  'Power': ({ nodes, data }) => new Power(nodes[data.customData.nodes.output1]),
  'Ground': ({ nodes, data }) => new Ground(nodes[data.customData.nodes.output1]),
  'ConstantVal': ({ nodes, data }) => new Constant(
    nodes[data.customData.nodes.output1],
    new BitString(data.customData.constructorParamaters[2], data.customData.constructorParamaters[1])
  ),
  'Random': ({ nodes, data }) => new Random(
    nodes[data.customData.nodes.maxValue],
    nodes[data.customData.nodes.clockInp],
    nodes[data.customData.nodes.output]
  ),
  'Counter': ({ nodes, data }) => new Counter(
    nodes[data.customData.nodes.maxValue],
    nodes[data.customData.nodes.clock],
    nodes[data.customData.nodes.reset],
    nodes[data.customData.nodes.output],
    nodes[data.customData.nodes.zero]
  ),
  'Clock': ({ nodes, data }) => new Clock(nodes[data.customData.nodes.output1]),
  'TriState': ({ nodes, data }) => new TriState(
    nodes[data.customData.nodes.inp1],
    nodes[data.customData.nodes.state],
    nodes[data.customData.nodes.output1]
  ),
  BitSelector: ({ nodes, data }) => new BitSelector(
    nodes[data.customData.nodes.inp1],
    nodes[data.customData.nodes.output1],
    nodes[data.customData.nodes.bitSelectorInp],
  ),
};

export class CircuitVerseLoader extends CircuitLoader {
  constructor() {
    super("CircuitVerseLoader");
  }

  load(data: any): CircuitProject {
    const project: CircuitProject = new CircuitProject();
    this.propagateLoggersTo(project);

    this.log(LogLevel.INFO, `Loading circuit from data:`, data);

    // Each scope is a circuit
    for (const scopeInd in data.scopes) {
      const scope = data.scopes[scopeInd];

      this.log(LogLevel.DEBUG, `Loading scope:`, scope);

      const nodes: CircuitBus[] = [];

      // First pass over nodes array to create nodes.
      for (let nodeInd = 0; nodeInd < scope.allNodes.length; nodeInd++) {
        const scopeNode = scope.allNodes[nodeInd];
        const node = new CircuitBus(scopeNode.bitWidth);
        nodes.push(node);
        this.log(
          LogLevel.TRACE,
          `Created bus with width ${scopeNode.bitWidth}`,
        );
      }

      // Second pass over nodes to add connections now that all nodes
      // are instantiated.
      for (let nodeInd = 0; nodeInd < scope.allNodes.length; nodeInd++) {
        const scopeNode = scope.allNodes[nodeInd];

        for (const connectInd in scopeNode.connections) {
          const ind = scopeNode.connections[connectInd];
          nodes[nodeInd].connect(nodes[ind]);
          this.log(LogLevel.TRACE, `Connecting bus: ${nodeInd} => ${ind}`);
        }
      }

      // CircuitVerse stores elements keyed by their type
      // in the same object as the scope properties. This is... dumb.
      //
      // Since we don't know what types we have in advnance, we create
      // a blacklist of all the keys that we know aren't circuit element
      // arrays, and don't process those.
      const blacklistKeys = [
        "layout",
        "verilogMetadata",
        "allNodes",
        "id",
        "name",
        "restrictedCircuitElementsUsed",
        "nodes",
      ];

      this.log(LogLevel.TRACE, "Collecting scope elements...");
      const elementArray = Object.keys(scope)
        .filter((k) => !blacklistKeys.includes(k))
        .map((k) =>
          scope[k].map((e: any, ind: number) => {
            e.objectType = k;
            e.index = ind;
            return e;
          }),
        )
        .flat();

      const id = scope.id;
      const name = scope.name;
      const elements: CircuitElement[] = [];

      for (const i in elementArray) {
        const elementData = elementArray[i];
        const type = elementData.objectType;

        this.log(LogLevel.TRACE, `Creating element of type '${type}'...`, elementData)

        if (!createElement[type]) {
          throw new Error(
            `Circuit '${name}' (${id}) uses unsupported element: ${type}.`,
          );
        }

        const newElement = createElement[type]({
          project: project,
          nodes: nodes,
          data: elementData
        }).setLabel(elementData.label)
          .setPropagationDelay(elementData.propagationDelay ?? 0);

        //console.log(LogLevel.DEBUG, `Creating element of type '${type}' with label '${data.label}'...`, elementData)


        elements.push(newElement);
      }

      // The final circuit for this scope.
      this.log(
        LogLevel.TRACE,
        "Constructing circuit and adding it to the project...",
      );
      const circuit = new Circuit(id, name, elements);
      project.addCircuit(circuit);
    }

    return project;
  }
}
