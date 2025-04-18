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
import { OrGate } from "../CircuitElement/OrGate";
import { Demultiplexer } from "../CircuitElement/Demultiplexer";
import { Multiplexer } from "../CircuitElement/Multiplexer";
import { BitSelector } from "../CircuitElement/BitSelector";
import { PriorityEncoder } from "../CircuitElement/PriorityEncoder";
import { Decoder } from "../CircuitElement/Decoder";
import { DFlipFlop } from "../CircuitElement/DFlipFlop";
import { JKFlipFlop } from "../CircuitElement/JKFlipFlop";
import { SRFlipFlop } from "../CircuitElement/SRFlipFlop";
import { BufferGate } from "../CircuitElement/BufferGate";
import fs from "node:fs";
import Stream from "stream";

function streamToString(stream: Stream) {
  const chunks: any = [];
  return new Promise((resolve, reject) => {
    stream.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
    stream.on("error", (err) => reject(err));
    stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
  });
}

async function loadXML(file: Stream) {
  const { XMLParser } = require("fast-xml-parser");
  const alwaysArray = [
    "project.circuit",
    "project.circuit.wire",
    "project.circuit.comp",
    "project.circuit.comp.a",
  ];
  const options = {
    ignoreAttributes: false,
    attributeNamePrefix: "",
    isArray: (name: any, jpath: string, isLeafNode: any, isAttribute: any) => {
      if (alwaysArray.indexOf(jpath) !== -1) return true;
    },
  };

  const parser = new XMLParser(options);
  const xmlData = await streamToString(file);
  const data = parser.parse(xmlData);
  return data;
}
type CircuitContext = {
  nodes: CircuitBus[];
  data: any;
  project: CircuitProject;
};

const createElement: Record<string, (ctx: CircuitContext) => CircuitElement> = {
  "AND Gate": ({ nodes, data }) =>
    new AndGate(
      data.inputs.map((i: number) => nodes[i]),
      [nodes[data.outputs]],
    ),
  "NOR Gate": ({ nodes, data }) =>
    new NorGate(
      data.inputs.map((i: number) => nodes[i]),
      [nodes[data.outputs]],
    ),
  "NAND Gate": ({ nodes, data }) =>
    new NandGate(
      data.inputs.map((i: number) => nodes[i]),
      [nodes[data.outputs]],
    ),
  "OR Gate": ({ nodes, data }) =>
    new OrGate(
      data.inputs.map((i: number) => nodes[i]),
      [nodes[data.outputs]],
    ),
  "NOT Gate": ({ nodes, data }) => {
    return new NotGate([nodes[data.inputs]], [nodes[data.outputs]]);
  },
  Buffer: ({ nodes, data }) =>
    new BufferGate([nodes[data.inputs]], [nodes[data.outputs]]),
  "XNOR Gate": ({ nodes, data }) =>
    new XnorGate(
      data.inputs.map((i: number) => nodes[i]),
      [nodes[data.outputs]],
    ),
  "XOR Gate": ({ nodes, data }) =>
    new XorGate(
      data.inputs.map((i: number) => nodes[i]),
      [nodes[data.outputs]],
    ),
  Input: ({ nodes, data }) =>
    new Input(data.index, data.name, [nodes[data.outputs]]),

  Output: ({ nodes, data }) =>
    new Output(data.index, data.name, nodes[data.inputs]),
  SubCircuit: ({ nodes, data, project }) => {
    return new SubCircuit(
      project.getCircuitById(data.circIndex),
      data.inputs.map((nodeInd: number) => nodes[nodeInd]),
      data.outputs.map((nodeInd: number) => nodes[nodeInd]),
    );
  },
  Power: ({ nodes, data }) => {
    return new Power(nodes[data.outputs]);
  },
  Ground: ({ nodes, data }) => new Ground(nodes[data.outputs]),
  Constant: ({ nodes, data }) => {
    return new Constant(
      nodes[data.outputs],
      new BitString(data.value, data.width),
    );
  },
  Demultiplexer: ({ nodes, data }) =>
    new Demultiplexer(
      [nodes[data.inputs]],
      data.output.map((i: number) => nodes[i]),
      nodes[data.signals],
    ),
  Multiplexer: ({ nodes, data }) =>
    new Multiplexer(
      data.inputs.map((i: number) => nodes[i]),
      [nodes[data.outputs]],
      nodes[data.signals],
    ),
  // "Priority Encoder": ({ nodes, data }) =>
  //     new PriorityEncoder(
  //         data.inputs.map((i: number) => nodes[i]),
  //         data.outputs.map((i: number) => nodes[i]),
  //         nodes[data.signals],
  //     ),
  // "Decoder": ({ nodes, data }) =>
  //     new Decoder(
  //         nodes[data.inputs],
  //         data.outputs.map((i: number) => nodes[i]),
  //     ),
  // "BitSelector": ({ nodes, data }) =>
  //     new BitSelector(
  //         nodes[data.inputs],
  //         nodes[data.outputs],
  //         nodes[data.signals],
  //     ),

  // TODO elements below not fully implemented
  // "Splitter": ({ nodes, data }) =>
  //     new Splitter(
  //         // No, this is not a typo in our code, their data file actually has "constructorParamaters"
  //         // instead of the proper spelling "constructorParameters"...
  //         data.customData.constructorParamaters[2],
  //         nodes[data.customData.nodes.inp1],
  //         data.customData.nodes.outputs.map((nodeInd: number) => nodes[nodeInd]),
  //     ),
  // "Counter": ({ nodes, data }) =>
  //     new Counter(
  //         nodes[data.customData.nodes.maxValue],
  //         nodes[data.customData.nodes.clock],
  //         nodes[data.customData.nodes.reset],
  //         nodes[data.customData.nodes.output],
  //         nodes[data.customData.nodes.zero],
  //     ),
  // "Clock": ({ nodes, data }) => new Clock(nodes[data.customData.nodes.output1]),
  // "D Flip-Flop": ({ nodes, data }) =>
  //     new DFlipFlop(
  //         nodes[data.customData.nodes.clockInp],
  //         nodes[data.customData.nodes.dInp],
  //         nodes[data.customData.nodes.qOutput],
  //         nodes[data.customData.nodes.qInvOutput],
  //         nodes[data.customData.nodes.reset],
  //         nodes[data.customData.nodes.preset],
  //         nodes[data.customData.nodes.en],
  //     ),
  // "T Flip-Flop": ({ nodes, data }) =>
  //     new TFlipFlop(
  //         nodes[data.customData.nodes.clockInp],
  //         nodes[data.customData.nodes.dInp],
  //         nodes[data.customData.nodes.qOutput],
  //         nodes[data.customData.nodes.qInvOutput],
  //         nodes[data.customData.nodes.reset],
  //         nodes[data.customData.nodes.preset],
  //         nodes[data.customData.nodes.en],
  //     ),
  // "J-K Flip-Flop": ({ nodes, data }) =>
  //     new JKFlipFlop(
  //         nodes[data.customData.nodes.clockInp],
  //         nodes[data.customData.nodes.J],
  //         nodes[data.customData.nodes.K],
  //         nodes[data.customData.nodes.qOutput],
  //         nodes[data.customData.nodes.qInvOutput],
  //         nodes[data.customData.nodes.reset],
  //         nodes[data.customData.nodes.preset],
  //         nodes[data.customData.nodes.en],
  //     ),
  // "S-R Flip-FLop": ({ nodes, data }) =>
  //     new SRFlipFlop(
  //         nodes[data.customData.nodes.S],
  //         nodes[data.customData.nodes.R],
  //         nodes[data.customData.nodes.qOutput],
  //         nodes[data.customData.nodes.qInvOutput],
  //         nodes[data.customNodes.nodes.reset],
  //         nodes[data.customData.nodes.preset],
  //         nodes[data.customData.nodes.en],
  //     ),
};

function coord2Num(coord: string) {
  let comma = coord.indexOf(",");
  let x = Number(coord.substring(1, comma));
  let y = Number(coord.substring(comma + 1, coord.length - 1));
  return [x, y];
}

function compareFn(a: any, b: any) {
  if (a instanceof Input && !(b instanceof Input)) {
    return -1;
  }
  // if (a == Input && b == Input || a != Input && b != Input) {
  //     return 0
  // }
  if (!(a instanceof Input) && b instanceof Input) {
    return 1;
  }
  return 0;
}
//X is width, Y height, and Z is the base side of the element.
//Z value is 0 for right/output side, 1 for left/input side, 2 for bottom/signal side, 3 for top
//X value is dependent on element. Some elements have base position based on outputs (ex: gates), others have it based on inputs or select bits (ex: demux and decoders, respectively)
//A positive X value indicates base position is based on the right side of the element, reserved for outputs, generally.
//A negative X value indicates base position is based on the left or bottom side of the element, inputs and signals, respectively.
//Note: In Logisim, (0,0) is located at the top left by default.
const sizeDict: any = {
  Input: [0, 0, 0],
  Output: [0, 0, 0],
  Power: [0, 0, 0],
  Ground: [0, 0, 0],
  Constant: [0, 0, 0],
  "AND Gate": [50, 60, 0],
  "NAND Gate": [60, 60, 0],
  "OR Gate": [50, 60, 0],
  "NOR Gate": [60, 60, 0],
  "XOR Gate": [60, 60, 0],
  "XNOR Gate": [70, 60, 0],
  "NOT Gate": [30, 20, 0],
  Buffer: [20, 20, 0],
  SubCircuit: [30, 20, 0], //Subcircuit will depend on the number of outputs and inputs...
  Multiplexer: [30, 40, 0],
  Demultiplexer: [30, 40, 1],
  Decoder: [30, 40, 2],
  BitSelector: [30, 30, 0],
  // TODO Positions below not set yet.
  "Priority Encoder": [50, 30, 0],
  Counter: [50, 30, 0],
  Splitter: [50, 30, 0],
  Clock: [50, 30, 0],
  "D Flip-Flop": [40, 30, 0],
  "S-R Flip-Flop": [40, 30, 0],
  "J-K Flip-Flop": [40, 30, 0],
};

export class LogisimLoader extends CircuitLoader {
  constructor() {
    super("LogisimLoader");
  }

  async load(stream: Stream): Promise<CircuitProject> {
    const project: CircuitProject = new CircuitProject();
    this.propagateLoggersTo(project);
    const data = await loadXML(stream);
    this.log(LogLevel.INFO, `Loading circuit from data:`, data);

    //check for subcircuits within circuits
    let subcircuits: any[] = [];
    for (let circuit of data.project.circuit) {
      subcircuits.push(circuit.name);
    }

    //Sort array of circuits so that circuits containing subcircuits are pushed to the end of the array so that the circuits those subcircuits refer to have been instantiated before the subcircuit is created
    let unparsedCircuitArray = data.project.circuit;
    let adjustList = [];
    for (let circuit in unparsedCircuitArray) {
      for (let component of unparsedCircuitArray[circuit].comp) {
        if (subcircuits.includes(component.name)) {
          adjustList.push(circuit);
        }
      }
    }
    for (let item of adjustList) {
      unparsedCircuitArray.push(
        unparsedCircuitArray.splice(Number(item), 1)[0],
      );
      subcircuits.push(subcircuits.splice(Number(item), 1)[0]);
    }

    for (
      let circuitIndex = 0;
      circuitIndex < unparsedCircuitArray.length;
      circuitIndex++
    ) {
      const scope = unparsedCircuitArray[circuitIndex];
      this.log(LogLevel.DEBUG, `Loading scope:`, scope);

      //Possibly need this if a circuit has no elements in it. Blank canvas upon saving.
      // if (!scope.wire || !scope.comp) {
      //     continue
      // }

      const wire2Node: { nodes: any[]; connections: any[]; widths: number[] } =
        {
          nodes: [], //Wire locations
          connections: [], //Node connections
          widths: [],
        };
      // Create list of all wires and connections
      for (let wireIndex = 0; wireIndex < scope.wire.length; wireIndex++) {
        const wire = scope.wire[wireIndex];
        //List of wire locations
        if (!wire2Node.nodes.includes(wire.from)) {
          wire2Node.nodes.push(wire.from);
          wire2Node.widths.push(1);
        }
        if (!wire2Node.nodes.includes(wire.to)) {
          wire2Node.nodes.push(wire.to);
          wire2Node.widths.push(1);
        }
        //Create list of connections for each node/wire based on index of wire locations
        let wireEnd1Index = wire2Node.nodes.indexOf(wire.from);
        let wireEnd2Index = wire2Node.nodes.indexOf(wire.to);

        (
          wire2Node.connections[wireEnd1Index] ||
          (wire2Node.connections[wireEnd1Index] = [])
        ).push(wireEnd2Index);
        (
          wire2Node.connections[wireEnd2Index] ||
          (wire2Node.connections[wireEnd2Index] = [])
        ).push(wireEnd1Index);
      }

      // Loop through component list to retrieve pertinant information
      let circElements: any = [];
      let inputIndex = 0;
      for (let compIndex in scope.comp) {
        const circElement: {
          type: string;
          name: string;
          width: number;
          outputPin?: boolean;
          inputs: number[];
          outputs: number[];
          signals?: number[];
          value?: string;
          index?: number;
          circIndex?: string;
        } = {
          type: " ",
          name: " ",
          width: 1,
          inputs: [],
          outputs: [],
          value: "0x1",
        };
        const component = scope.comp[compIndex];
        if (subcircuits.includes(component.name)) {
          circElement.type = "SubCircuit";
          circElement.circIndex = subcircuits
            .indexOf(component.name)
            .toString();
        } else if (component.name === "Pin") {
          circElement.type = "Input";
          circElement.index = inputIndex;
          inputIndex++;
        } else circElement.type = component.name;
        const compAttributes = component.a;
        for (let attrIndex in compAttributes) {
          let attribute = compAttributes[attrIndex];
          if (attribute.name === "label") {
            circElement.name = attribute.val;
          }
          if (attribute.name === "width") {
            circElement.width = Number(attribute.val);
          }
          if (attribute.name === "output") {
            circElement.outputPin = true;
            circElement.type = "Output";
            inputIndex--;
          }
          if (attribute.name === "value") {
            circElement.value = attribute.val;
          }
        }

        //Positional/dimensional Data for element
        let [locx, locy] = coord2Num(component.loc);
        const dimensions = sizeDict[circElement.type];
        const xDim = dimensions[0];
        const yDim = dimensions[1];
        const baseSide = dimensions[2];
        let xMax, xMin, yMax, yMin;
        switch (baseSide) {
          case 0: //Base position is on the right side of the element, the output side
            xMax = locx;
            xMin = xMax - xDim;
            yMax = locy + (1 / 2) * yDim;
            yMin = locy - (1 / 2) * yDim;
            break;
          case 1: //Base position is on the left side of the element, the input side
            xMax = locx + xDim;
            xMin = locx;
            yMax = locy + (1 / 2) * yDim;
            yMin = locy - (1 / 2) * yDim;
            break;
          case 2: //Base position is on the bottom of the element, the signal side
            xMax = locx + 10;
            xMin = xMax - xDim;
            yMax = locy;
            yMin = locy - yDim;
            break;
          case 3: //Base position is on the top of the element. Not used in anything so far.
            xMax = locx + 10;
            xMin = xMax - xDim;
            yMax = locy + yDim;
            yMin = locy;
            break;
          default:
            throw new Error(
              `Circuit '${scope.name}' (${circElement.name}) uses unsupported element: ${circElement.type}.`,
            );
        }
        //Elements without inputs
        const inputBlacklist = [
          "Input",
          "Power",
          "Ground",
          "Constant",
          "Decoder",
        ];
        const outputBlacklist = ["Output"];
        //Signals (Multiplexer, de-multiplexer)
        const signalWireElements = [
          "Multiplexer",
          "Demultiplexer",
          "Decoder",
          "Priority Encoder",
          "Bit Selector",
        ];

        for (let node of wire2Node.nodes) {
          let [x, y] = coord2Num(node);
          //Inputs, left side of element
          if (!inputBlacklist.includes(circElement.type)) {
            if (x == xMin && yMin <= y && y <= yMax) {
              circElement.inputs.push(wire2Node.nodes.indexOf(node));
            }
          }
          //Outputs, right side of element
          if (!outputBlacklist.includes(circElement.type)) {
            if (x == xMax && yMin <= y && y <= yMax) {
              circElement.outputs.push(wire2Node.nodes.indexOf(node));
            }
          }
          //Signals, bottom of element
          if (signalWireElements.includes(circElement.type)) {
            circElement.signals = [];
            if (xMin <= x && x <= xMax && y == yMax) {
              circElement.signals.push(wire2Node.nodes.indexOf(node));
            }
          }
        }

        //Update bitWidths of wire2node arrays
        for (let index of circElement.inputs) {
          wire2Node.widths[index] = circElement.width;
        }
        for (let index of circElement.outputs) {
          wire2Node.widths[index] = circElement.width;
        }
        //Add elements data to array so nodes can be created with proper bitwidth
        circElements.push(circElement);
      }

      const nodes: CircuitBus[] = [];
      for (let nodeInd = 0; nodeInd < wire2Node.nodes.length; nodeInd++) {
        //defaulting to 1 since bitwidth is stored in elements, not nodes
        const node = new CircuitBus(wire2Node.widths[nodeInd]);
        nodes.push(node);
        this.log(
          LogLevel.TRACE,
          `Created bus with width ${wire2Node.widths[nodeInd]}`,
        );
      }
      for (let nodeInd = 0; nodeInd < wire2Node.connections.length; nodeInd++) {
        const scopeNode = wire2Node.connections[nodeInd];
        for (const connectInd in scopeNode) {
          const ind = scopeNode[connectInd];
          nodes[nodeInd].connect(nodes[ind]);
          this.log(LogLevel.TRACE, `Connecting bus: ${nodeInd} => ${ind}`);
        }
      }

      let elements: CircuitElement[] = [];
      for (let elem of circElements) {
        this.log(
          LogLevel.TRACE,
          `Creating element of type '${elem.type}'...`,
          elem,
        );

        if (!createElement[elem.type]) {
          throw new Error(
            `Circuit '${scope.name}' (${elem.name}) uses unsupported element: ${elem.type}.`,
          );
        }
        const newElement = createElement[elem.type]({
          project: project,
          nodes: nodes,
          data: elem,
        });
        newElement.setLabel(elem.name);
        newElement.setPropagationDelay(10);
        elements.push(newElement);
      }

      elements.sort(compareFn);
      const circuit = new Circuit(
        circuitIndex.toString(),
        scope.name,
        elements,
      );
      project.addCircuit(circuit);
    }
    return project;
  }
}
