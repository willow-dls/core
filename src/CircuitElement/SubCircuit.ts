import { Circuit } from "../Circuit";
import { CircuitElement } from "../CircuitElement";
import { CircuitBus } from "../CircuitBus";
import { LogLevel } from "../CircuitLogger";
import { Clock } from "./Clock";
import { CircuitProject } from "../CircuitProject";

type cirHolder = {
    circuit: Circuit;
    project?: never;
    circuitIndex?: never;
} |
{
    circuit?: never;
    project: CircuitProject;
    circuitIndex: string;
}

export class SubCircuit extends CircuitElement {
    #circuitRetrieval: cirHolder;


    constructor(circuit: Circuit | [CircuitProject, string], inputs: CircuitBus[], outputs: CircuitBus[]) {
        super("SubCircuitElement", inputs, outputs);
        if (circuit instanceof Circuit) {
            this.#circuitRetrieval = { circuit: circuit };
        }
        else {
            this.#circuitRetrieval = { project: circuit[0], circuitIndex: circuit[1] }
        }

    }

    setCircuit(): Circuit {
        return this.#circuitRetrieval.circuit ? this.#circuitRetrieval.circuit : this.#circuitRetrieval.project.getCircuitById(this.#circuitRetrieval.circuitIndex)
    }

    resolve(): number {
        let circuit = this.setCircuit()
        this.log(
            LogLevel.DEBUG,
            `Executing Subcircuit: [id = ${circuit.getId()}, name = '${circuit.getName()}']`,
        );

        const inputs = this.getInputs();
        const outputs = this.getOutputs();

        const result = circuit.resolve(inputs.map((node) => node.getValue()));

        result.outputs.forEach((value, index) => {
            outputs[index].setValue(value);
        });

        this.log(
            LogLevel.DEBUG,
            `Subcircuit complete: [id = ${circuit.getId()}, name = '${circuit.getName()}']`,
            result,
        );

        return result.propagationDelay;
    }

    getClocks(): Clock[] {
        let circuit = this.setCircuit()
        return circuit.getClocks();
    }
}
