/*
 * Copyright (c) 2025 Jordan Bancino <jordan@bancino.net>
 * Copyright (c) 2025 Austin Hargis <hargisa@mail.gvsu.edu>
 * Copyright (c) 2025 Aaron MacDougall <macdouaa@mail.gvsu.edu>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

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
import { DFlipFlop } from "../CircuitElement/DFlipFlop";
import { TFlipFlop } from "../CircuitElement/TFlipFlop";
import { DLatch } from "../CircuitElement/DLatch";
import { JKFlipFlop } from "../CircuitElement/JKFlipFlop";
import { SRFlipFlop } from "../CircuitElement/SRFlipFlop";
import { TwosCompliment } from "../CircuitElement/TwosCompliment";
import { Adder } from "../CircuitElement/Adder";
import { BufferGate } from "../CircuitElement/BufferGate";
import { ControlledInverter } from "../CircuitElement/ControlledInverter";
import { CircuitVerseALU } from "../CircuitElement/CircuitVerseALU";
import Stream from "stream";
import { FileUtil } from "../Util/File";
import { ROM } from "../CircuitElement/ROM";
import { CircuitVerseRAM } from "../CircuitElement/CircuitVerseRAM";

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
  Buffer: ({ nodes, data }) =>
    new BufferGate(
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
      nodes[data.customData.nodes.controlSignalInput],
    ),
  LSB: ({ nodes, data }) =>
    new LSB(
      nodes[data.customData.nodes.inp1],
      nodes[data.customData.nodes.output1],
      nodes[data.customData.nodes.enable],
    ),
  MSB: ({ nodes, data }) =>
    new MSB(
      nodes[data.customData.nodes.inp1],
      nodes[data.customData.nodes.output1],
      nodes[data.customData.nodes.enable],
    ),
  PriorityEncoder: ({ nodes, data }) =>
    new PriorityEncoder(
      data.customData.nodes.inp1.map((i: number) => nodes[i]),
      data.customData.nodes.output1.map((i: number) => nodes[i]),
      nodes[data.customData.nodes.enable],
    ),
  Decoder: ({ nodes, data }) =>
    new Decoder(
      nodes[data.customData.nodes.input],
      data.customData.nodes.output1.map((i: number) => nodes[i]),
    ),
  Input: ({ nodes, data }) =>
    new Input(data.index, data.label, [nodes[data.customData.nodes.output1]]),
  // Treat a button just like a regular input.
  Button: ({ nodes, data }) =>
    new Input(data.index, data.label, [nodes[data.customData.nodes.output1]]),
  // Treat a stepper just like a regular input.
  Stepper: ({ nodes, data }) =>
    new Input(data.index, data.label, [nodes[data.customData.nodes.output1]]),
  Output: ({ nodes, data }) =>
    new Output(data.index, data.label, nodes[data.customData.nodes.inp1]),
  SubCircuit: ({ nodes, data, project }) =>
    new SubCircuit(
      project.getCircuitById(data.id),
      data.inputNodes.map((nodeInd: number) => nodes[nodeInd]),
      data.outputNodes.map((nodeInd: number) => nodes[nodeInd]),
    ),
  Splitter: ({ nodes, data }) =>
    new Splitter(
      // No, this is not a typo in our code, their data file actually has "constructorParamaters"
      // instead of the proper spelling "constructorParameters"...
      data.customData.constructorParamaters[2],
      nodes[data.customData.nodes.inp1],
      data.customData.nodes.outputs.map((nodeInd: number) => nodes[nodeInd]),
    ),
  Power: ({ nodes, data }) => new Power(nodes[data.customData.nodes.output1]),
  Ground: ({ nodes, data }) => new Ground(nodes[data.customData.nodes.output1]),
  ConstantVal: ({ nodes, data }) =>
    new Constant(
      nodes[data.customData.nodes.output1],
      new BitString(
        data.customData.constructorParamaters[2],
        data.customData.constructorParamaters[1],
      ),
    ),
  Random: ({ nodes, data }) =>
    new Random(
      nodes[data.customData.nodes.maxValue],
      nodes[data.customData.nodes.clockInp],
      nodes[data.customData.nodes.output],
    ),
  Counter: ({ nodes, data }) =>
    new Counter(
      nodes[data.customData.nodes.maxValue],
      nodes[data.customData.nodes.clock],
      nodes[data.customData.nodes.reset],
      nodes[data.customData.nodes.output],
      nodes[data.customData.nodes.zero],
    ),
  Clock: ({ nodes, data }) => new Clock(nodes[data.customData.nodes.output1]),
  TriState: ({ nodes, data }) =>
    new TriState(
      nodes[data.customData.nodes.inp1],
      nodes[data.customData.nodes.state],
      nodes[data.customData.nodes.output1],
    ),
  BitSelector: ({ nodes, data }) =>
    new BitSelector(
      nodes[data.customData.nodes.inp1],
      nodes[data.customData.nodes.output1],
      nodes[data.customData.nodes.bitSelectorInp],
    ),
  DflipFlop: ({ nodes, data }) =>
    new DFlipFlop(
      nodes[data.customData.nodes.clockInp],
      nodes[data.customData.nodes.dInp],
      nodes[data.customData.nodes.qOutput],
      nodes[data.customData.nodes.qInvOutput],
      nodes[data.customData.nodes.reset],
      nodes[data.customData.nodes.preset],
      nodes[data.customData.nodes.en],
    ),
  TflipFlop: ({ nodes, data }) =>
    new TFlipFlop(
      nodes[data.customData.nodes.clockInp],
      nodes[data.customData.nodes.dInp],
      nodes[data.customData.nodes.qOutput],
      nodes[data.customData.nodes.qInvOutput],
      nodes[data.customData.nodes.reset],
      nodes[data.customData.nodes.preset],
      nodes[data.customData.nodes.en],
    ),
  Dlatch: ({ nodes, data }) =>
    new DLatch(
      nodes[data.customData.nodes.clockInp],
      nodes[data.customData.nodes.dInp],
      nodes[data.customData.nodes.qOutput],
      nodes[data.customData.nodes.qInvOutput],
    ),
  JKflipFlop: ({ nodes, data }) =>
    new JKFlipFlop(
      nodes[data.customData.nodes.clockInp],
      nodes[data.customData.nodes.J],
      nodes[data.customData.nodes.K],
      nodes[data.customData.nodes.qOutput],
      nodes[data.customData.nodes.qInvOutput],
      nodes[data.customData.nodes.reset],
      nodes[data.customData.nodes.preset],
      nodes[data.customData.nodes.en],
    ),
  SRflipFlop: ({ nodes, data }) =>
    new SRFlipFlop(
      nodes[data.customData.nodes.S],
      nodes[data.customData.nodes.R],
      nodes[data.customData.nodes.qOutput],
      nodes[data.customData.nodes.qInvOutput],
      nodes[data.customNodes.nodes.reset],
      nodes[data.customData.nodes.preset],
      nodes[data.customData.nodes.en],
    ),
  TwoCompliment: ({ nodes, data }) =>
    new TwosCompliment(
      nodes[data.customData.nodes.inp1],
      nodes[data.customData.nodes.output1],
    ),
  Adder: ({ nodes, data }) =>
    new Adder(
      nodes[data.customData.nodes.inpA],
      nodes[data.customData.nodes.inpB],
      nodes[data.customData.nodes.carryIn],
      nodes[data.customData.nodes.sum],
      nodes[data.customData.nodes.carryOut],
    ),
  ControlledInverter: ({ nodes, data }) =>
    new ControlledInverter(
      nodes[data.customData.nodes.inp1],
      nodes[data.customData.nodes.state],
      nodes[data.customData.nodes.output1],
    ),
  ALU: ({ nodes, data }) =>
    new CircuitVerseALU(
      nodes[data.customData.nodes.inp1],
      nodes[data.customData.nodes.inp2],
      nodes[data.customData.nodes.controlSignalInput],
      nodes[data.customData.nodes.output],
      nodes[data.customData.nodes.carryOut],
    ),
  Rom: ({ nodes, data }) =>
    new ROM(
      nodes[data.customData.nodes.memAddr],
      nodes[data.customData.nodes.dataOut],
      nodes[data.customData.nodes.en],
      data.customData.constructorParamaters[0].map(
        (byte: string) => new BitString(parseInt(byte).toString(2), 8),
      ),
      16, // ROM is 16 bytes in CircuitVerse
    ),
  RAM: ({ nodes, data }) =>
    new CircuitVerseRAM(
      nodes[data.customData.nodes.address],
      nodes[data.customData.data.dataIn],
      nodes[data.customData.nodes.write],
      nodes[data.customData.nodes.reset],
      nodes[data.customData.nodes.dataOut],
      1024, // RAM is 1kb in CircuitVerse
      data.customData.constructorParamaters[1],
      [], // No initial data stored in RAM.
    ),
  // Functions exactly like RAM but is smaller and has
  // custom data.
  EEPROM: ({ nodes, data }) =>
    new CircuitVerseRAM(
      nodes[data.customData.nodes.address],
      nodes[data.customData.data.dataIn],
      nodes[data.customData.nodes.write],
      nodes[data.customData.nodes.reset],
      nodes[data.customData.nodes.dataOut],
      256, // EEPROM is 256 bytes
      data.customData.constructorParamaters[1],
      data.customData.constructorParamaters[3].map(
        (byte: string) => new BitString(parseInt(byte).toString(2), 8),
      ),
    ),
};

/**
 * A circuit loader that loads CircuitVerse `.cv` files. This loader is the
 * reference implementation of a circuit loader and actually is the inspiration
 * for a lot of the design of this engine. Decisions about how the engine should
 * be structured were made largely around how CircuitVerse stores data in their
 * data files, which means that circuits loaded from CircuitVerse will likely run
 * better than circuits from other engines, as this loader was developed in sync
 * with the rest of the engine, and others were added after.
 */
export class CircuitVerseLoader extends CircuitLoader {
  constructor() {
    super("CircuitVerseLoader");
  }

  async load(stream: Stream): Promise<CircuitProject> {
    const project: CircuitProject = new CircuitProject();
    this.propagateLoggersTo(project);

    const data = await FileUtil.readJsonStream(stream);

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
        // Annotation elements which are visual only.
        "Text",
        "Rectangle",
        "Arrow",
        "ImageAnnotation",
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

        this.log(
          LogLevel.TRACE,
          `Creating element of type '${type}'...`,
          elementData,
        );

        if (!createElement[type]) {
          throw new Error(
            `Circuit '${name}' (${id}) uses unsupported element: ${type}.`,
          );
        }

        const newElement = createElement[type]({
          project: project,
          nodes: nodes,
          data: elementData,
        })
          .setLabel(elementData.label)
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
