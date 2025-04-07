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
};

function coord2Num(coord: string) {
    let comma = coord.indexOf(',')
    let x = Number(coord.substring(1, comma))
    let y = Number(coord.substring(comma + 1, coord.length - 1))
    return [x, y]
}

//Function for loading data. Needs to move to and be integrated into CircuitLoad somehow

import fs from "node:fs";
const { XMLParser } = require("fast-xml-parser");

function loadXML(file: string) {
    let xmlData = fs.readFileSync(file, 'utf8')

    const alwaysArray = [
        "project.circuit",
        "project.circuit.wire",
        "project.circuit.comp",
        "project.circuit.comp.a"
    ]
    const options = {
        ignoreAttributes: false,
        attributeNamePrefix: "",
        isArray: (jpath: any) => {
            if (alwaysArray.indexOf(jpath) !== -1) return true;
        }
    }

    const parser = new XMLParser(options)
    const data = parser.parse(xmlData)
    return data
}


export class LogisimLoader extends CircuitLoader {
    constructor() {
        super("LogisimLoader");
    }

    load(data: any): CircuitProject {
        const project: CircuitProject = new CircuitProject();
        this.propagateLoggersTo(project);

        this.log(LogLevel.INFO, `Loading circuit from data:`, data);

        for (const circuitIndex in data.project.circuit) {
            const circuit = data.project.circuit[circuitIndex]
            let circuitName = circuit["name"]

            const wire2Node: { nodes: any[], connections: any[] } = {
                nodes: [],
                connections: []
            }
            // Create list of all wire locations
            for (let wireIndex = 0; wireIndex < circuit.wire.length; wireIndex++) {
                const wire = circuit.wire[wireIndex]
                if (!wire2Node.nodes.includes(wire.from)) {
                    wire2Node.nodes.push(wire.from);
                }
                if (!wire2Node.nodes.includes(wire.to)) {
                    wire2Node.nodes.push(wire.to);
                }
            }
            //Create list of connections for each node/wire based on index of wire locations
            for (let wireIndex = 0; wireIndex < circuit.wire.length; wireIndex++) {
                const wire = circuit.wire[wireIndex]
                let wireEnd1Index = wire2Node.nodes.indexOf(wire.from);
                let wireEnd2Index = wire2Node.nodes.indexOf(wire.to);

                (wire2Node.connections[wireEnd1Index] || (wire2Node.connections[wireEnd1Index] = [])).push(wireEnd2Index);
                (wire2Node.connections[wireEnd2Index] || (wire2Node.connections[wireEnd2Index] = [])).push(wireEnd1Index);
            }

            let circElementList: any[] = []
            // Loop through component list to retrieve pertinant information
            for (let compIndex in circuit.comp) {
                const circElement: { type: string, name: string, width: number, outputPin: boolean, inputs: number[], outputs: number[] } = {
                    type: '',
                    name: '',
                    width: 1,
                    outputPin: false,
                    inputs: [],
                    outputs: [],
                }
                const component = circuit.comp[compIndex]
                let loc = component.loc
                circElement.type = component.name
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
                        circElement.inputs.push(wire2Node.nodes.indexOf(loc))
                    }
                }

                let outputNodeIndex = wire2Node.nodes.indexOf(loc);

                if (outputNodeIndex > -1 && circElement.outputPin === false) {
                    circElement.outputs.push(outputNodeIndex)
                }
                if (circElement.type != "Pin") {
                    let [locx, locy] = coord2Num(loc)
                    let xbound = locx - 50;
                    let ymin = locy - 30;
                    let ymax = locy + 30;
                    for (let node of wire2Node.nodes) {
                        let [x, y] = coord2Num(node)
                        if (x === xbound && y > ymin && y < ymax) {
                            circElement.inputs.push(wire2Node.nodes.indexOf(node))
                        }
                    }
                }

                circElementList.push(circElement)
            }
            console.log(circElementList)
        }
    }
}
