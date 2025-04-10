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

type CircuitContext = {
    nodes: CircuitBus[];
    data: any;
    project: CircuitProject;
};

// const circElement: { type: string, name: string, width: number, outputPin: boolean, inputs: number[], outputs: number[], index: number } = {
//     type: '',
//     name: '',
//     width: 1,
//     outputPin: false,
//     inputs: [],
//     outputs: [],
//     index: Number(compIndex)
// }
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
        new Input(data.index, data.label, [nodes[data.outputs]]),

    "Output": ({ nodes, data }) =>
        new Output(data.index, data.label, nodes[data.inputs]),
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
    // "SubCircuit": ({ nodes, data, project }) =>
    //     new SubCircuit(
    //         project.getCircuitById(data.id),
    //         data.inputNodes.map((nodeInd: number) => nodes[nodeInd]),
    //         data.outputNodes.map((nodeInd: number) => nodes[nodeInd]),
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

        for (const circuitIndex in data.project.circuit) {
            const scope = data.project.circuit[circuitIndex]
            this.log(LogLevel.DEBUG, `Loading scope:`, scope);



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
            for (let compIndex in scope.comp) {
                const circElement: { type: string, name: string, width: number, outputPin: boolean, inputs: number[], outputs: number[], index: number } = {
                    type: '',
                    name: '',
                    width: 1,
                    outputPin: false,
                    inputs: [],
                    outputs: [],
                    index: Number(compIndex)
                }
                const component = scope.comp[compIndex]
                let loc = component.loc
                if (subcircuits.includes(component.name)) circElement.type = "Subcircuit"
                else if (circElement.type = "Pin") circElement.type = "Input"
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
                        circElement.inputs.push(wire2Node.nodes.indexOf(loc))
                    }
                }

                let outputNodeIndex = wire2Node.nodes.indexOf(loc);

                if (outputNodeIndex > -1 && circElement.outputPin === false) {
                    circElement.outputs.push(outputNodeIndex)
                }
                if (circElement.type != "Pin") {
                    let [locx, locy] = coord2Num(loc)
                    let xmin = locx - 75;
                    let xmax = locx - 30;
                    let ymin = locy - 30;
                    let ymax = locy + 30;
                    for (let node of wire2Node.nodes) {
                        let [x, y] = coord2Num(node)
                        if (x > xmin && x < xmax && y > ymin && y < ymax) {
                            circElement.inputs.push(wire2Node.nodes.indexOf(node))
                        }
                    }
                }

                const newElement = createElement[circElement.type]({
                    project: project,
                    nodes: nodes,
                    data: circElement,
                })
                    .setLabel(circElement.name)

                elements.push(newElement)
            }

            const circuit = new Circuit(circuitIndex, scope["name"], elements)
            project.addCircuit(circuit)
        }
        return project
    }
}
