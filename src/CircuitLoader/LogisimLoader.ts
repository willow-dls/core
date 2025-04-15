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

import fs from "node:fs";

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
    "NOT Gate": ({ nodes, data }) =>
        new NotGate(
            [nodes[data.inputs]],
            [nodes[data.outputs]],
        ),
    "Buffer": ({ nodes, data }) =>
        new BufferGate(
            [nodes[data.inputs]],
            [nodes[data.outputs]],
        ),
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
    "Input": ({ nodes, data }) =>
        new Input(data.index, data.name, [nodes[data.outputs]]),

    "Output": ({ nodes, data }) =>
        new Output(data.index, data.name, nodes[data.inputs]),
    "SubCircuit": ({ nodes, data, project }) => {
        return new SubCircuit(
            project.getCircuitById(data.circIndex),
            data.inputs.map((nodeInd: number) => nodes[nodeInd]),
            data.outputs.map((nodeInd: number) => nodes[nodeInd]),
        )
    },
    // "Demultiplexer": ({ nodes, data }) =>
    //     new Demultiplexer(
    //         [nodes[data.customData.nodes.input]],
    //         data.customData.nodes.output1.map((i: number) => nodes[i]),
    //         nodes[data.customData.nodes.controlSignalInput],
    //     ),
    // "Multiplexer": ({ nodes, data }) =>
    //     new Multiplexer(
    //         data.customData.nodes.inp.map((i: number) => nodes[i]),
    //         [nodes[data.customData.nodes.output1]],
    //         nodes[data.customData.nodes.controlSignalInput],
    //     ),
    // "Priority Encoder": ({ nodes, data }) =>
    //     new PriorityEncoder(
    //         data.customData.nodes.inp1.map((i: number) => nodes[i]),
    //         data.customData.nodes.output1.map((i: number) => nodes[i]),
    //         nodes[data.customData.nodes.enable],
    //     ),
    // "Decoder": ({ nodes, data }) =>
    //     new Decoder(
    //         nodes[data.customData.nodes.input],
    //         data.customData.nodes.output1.map((i: number) => nodes[i]),
    //     ),
    // "Splitter": ({ nodes, data }) =>
    //     new Splitter(
    //         // No, this is not a typo in our code, their data file actually has "constructorParamaters"
    //         // instead of the proper spelling "constructorParameters"...
    //         data.customData.constructorParamaters[2],
    //         nodes[data.customData.nodes.inp1],
    //         data.customData.nodes.outputs.map((nodeInd: number) => nodes[nodeInd]),
    //     ),
    // "Power": ({ nodes, data }) => new Power(nodes[data.customData.nodes.output1]),
    // "Ground": ({ nodes, data }) => new Ground(nodes[data.customData.nodes.output1]),
    // "Constant": ({ nodes, data }) =>
    //     new Constant(
    //         nodes[data.customData.nodes.output1],
    //         new BitString(
    //             data.customData.constructorParamaters[2],
    //             data.customData.constructorParamaters[1],
    //         ),
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
    // "BitSelector": ({ nodes, data }) =>
    //     new BitSelector(
    //         nodes[data.customData.nodes.inp1],
    //         nodes[data.customData.nodes.output1],
    //         nodes[data.customData.nodes.bitSelectorInp],
    //     ),
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
    let comma = coord.indexOf(',')
    let x = Number(coord.substring(1, comma))
    let y = Number(coord.substring(comma + 1, coord.length - 1))
    return [x, y]
}

function compareFn(a: any, b: any) {

    if (a instanceof Input && !(b instanceof Input)) {
        return -1
    }
    // if (a == Input && b == Input || a != Input && b != Input) {
    //     return 0
    // }
    if (!(a instanceof Input) && b instanceof Input) {
        return 1
    }
    return 0
}

const sizeDict: any = {
    "AND Gate": [50, 30],
    "NAND Gate": [60, 30],
    "OR Gate": [50, 30],
    "NOR Gate": [60, 30],
    "XOR Gate": [60, 30],
    "XNOR Gate": [70, 30],
    "NOT Gate": [30, 0],
    "Buffer": [20, 0],
    "SubCircuit": [30, 20],
    // TODO Positions below not set yet.
    "Multiplexer": [50, 30],
    "Demultiplexer": [50, 30],
    "Priority Encoder": [50, 30],
    "Decoder": [50, 30],
    "Counter": [50, 30],
    "Splitter": [50, 30],
    "Clock": [50, 30],
    "BitSelector": [50, 30],
    "D Flip-Flop": [40, 30],
    "S-R Flip-Flop": [40, 30],
    "J-K Flip-Flop": [40, 30],
}

export class LogisimLoader extends CircuitLoader {
    constructor() {
        super("LogisimLoader");
    }

    load(data: any): CircuitProject {
        const project: CircuitProject = new CircuitProject();
        this.propagateLoggersTo(project);

        this.log(LogLevel.INFO, `Loading circuit from data:`, data);

        let subcircuits: any[] = []
        for (let circuit of data.project.circuit) {
            subcircuits.push(circuit.name)
        }
        let unparsedCircuitArray = data.project.circuit;
        let adjustList = []
        console.log(unparsedCircuitArray)
        for (let circuit in unparsedCircuitArray) {
            for (let component of unparsedCircuitArray[circuit].comp) {
                if (subcircuits.includes(component.name)) {
                    adjustList.push(circuit)

                }
            }
        }
        console.log(subcircuits)
        for (let item of adjustList) {
            unparsedCircuitArray.push(unparsedCircuitArray.splice(Number(item), 1)[0])
            subcircuits.push(subcircuits.splice(Number(item), 1)[0])
        }
        console.log(subcircuits)
        for (let circuitIndex = 0; circuitIndex < unparsedCircuitArray.length; circuitIndex++) {
            const scope = unparsedCircuitArray[circuitIndex]
            this.log(LogLevel.DEBUG, `Loading scope:`, scope);

            //Possibly need this if a circuit has no elements in it. Blank canvas upon saving.
            // if (!scope.wire || !scope.comp) {
            //     continue
            // }

            const wire2Node: { nodes: any[], connections: any[] } = {
                nodes: [], //Wire locations
                connections: [] //Node connections
            }
            // Create list of all wires and connections
            for (let wireIndex = 0; wireIndex < scope.wire.length; wireIndex++) {
                const wire = scope.wire[wireIndex]
                //List of wire locations
                if (!wire2Node.nodes.includes(wire.from)) {
                    wire2Node.nodes.push(wire.from);
                }
                if (!wire2Node.nodes.includes(wire.to)) {
                    wire2Node.nodes.push(wire.to);
                }
                //Create list of connections for each node/wire based on index of wire locations
                let wireEnd1Index = wire2Node.nodes.indexOf(wire.from);
                let wireEnd2Index = wire2Node.nodes.indexOf(wire.to);

                (wire2Node.connections[wireEnd1Index] || (wire2Node.connections[wireEnd1Index] = [])).push(wireEnd2Index);
                (wire2Node.connections[wireEnd2Index] || (wire2Node.connections[wireEnd2Index] = [])).push(wireEnd1Index);
            }

            const nodes: CircuitBus[] = []
            for (let nodeInd = 0; nodeInd < wire2Node.nodes.length; nodeInd++) {
                //defaulting to 1 since bitwidth is stored in elements, not nodes
                const node = new CircuitBus(1)
                nodes.push(node);
                this.log(
                    LogLevel.TRACE,
                    `Created bus with width ${1}`,
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

            // Loop through component list to retrieve pertinant information
            let elements: CircuitElement[] = []
            let inputIndex = 0;
            for (let compIndex in scope.comp) {
                const circElement: { type: string, name: string, width: number, outputPin?: boolean, inputs: number[], outputs: number[], index?: number, circIndex?: string } = {
                    type: ' ',
                    name: ' ',
                    width: 1,
                    inputs: [],
                    outputs: [],
                }
                const component = scope.comp[compIndex]
                if (subcircuits.includes(component.name)) {
                    circElement.type = "SubCircuit"
                    circElement.circIndex = subcircuits.indexOf(component.name).toString();
                }
                else if (component.name === "Pin") {
                    circElement.type = "Input"
                    circElement.index = inputIndex
                    inputIndex++
                }
                else circElement.type = component.name
                const compAttributes = component.a
                for (let attrIndex in compAttributes) {
                    let attribute = compAttributes[attrIndex]
                    if (attribute.name === "label") {
                        circElement.name = attribute.val
                    }
                    if (attribute.name === "width") {
                        circElement.width = Number(attribute.val)
                    }
                    if (attribute.name === "output") {
                        circElement.outputPin = true
                        circElement.type = "Output"
                        circElement.inputs.push(wire2Node.nodes.indexOf(component.loc))
                        inputIndex--
                    }
                }
                let loc = component.loc
                let outputNodeIndex = wire2Node.nodes.indexOf(component.loc);

                //Outputs
                if (outputNodeIndex > -1 && !circElement.outputPin) {
                    circElement.outputs.push(outputNodeIndex)
                }
                //Inputs
                if (circElement.type != "Input" && circElement.type != "Output") {
                    //May need to make dictionary with each element type as a key, with sizes to check for input wires
                    let [locx, locy] = coord2Num(loc)
                    let [xWindow, yWindow] = sizeDict[circElement.type]
                    let xmin = locx - xWindow
                    //May need to change this to account for multiplexers and other things with more than just inputs and outputs
                    let xmax = locx - xWindow;
                    let ymin = locy - yWindow
                    let ymax = locy + yWindow;
                    for (let node of wire2Node.nodes) {
                        let [x, y] = coord2Num(node)
                        if (xmin <= x && x <= xmax && ymin <= y && y <= ymax) {
                            circElement.inputs.push(wire2Node.nodes.indexOf(node))
                        }
                    }
                }

                this.log(
                    LogLevel.TRACE,
                    `Creating element of type '${circElement.type}'...`,
                    circElement,
                );

                if (!createElement[circElement.type]) {
                    throw new Error(
                        `Circuit '${scope.name}' (${circElement.name}) uses unsupported element: ${circElement.type}.`,
                    );
                }
                const newElement = createElement[circElement.type]({
                    project: project,
                    nodes: nodes,
                    data: circElement,
                })
                newElement.setLabel(circElement.name)
                newElement.setPropagationDelay(10)
                elements.push(newElement)
            }
            elements.sort(compareFn)
            const circuit = new Circuit(circuitIndex.toString(), scope.name, elements)
            project.addCircuit(circuit)
        }
        return project
    }
}
