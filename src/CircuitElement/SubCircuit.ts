import { Circuit } from "../Circuit";
import { CircuitElement } from "../CircuitElement";
import { CircuitBus } from "../CircuitBus";
import { LogLevel } from "../CircuitLogger";

export class SubCircuit extends CircuitElement {
    #circuit: Circuit;
    
    constructor(circuit: Circuit, inputs: CircuitBus[], outputs: CircuitBus[]) {
        super('SubCircuitElement', inputs, outputs);
        this.#circuit = circuit;
    }

    resolve(): number {
        this.log(LogLevel.DEBUG, `Executing Subcircuit: [id = ${this.#circuit.getId()}, name = '${this.#circuit.getName()}']`);

        const inputs = this.getInputs();
        const outputs = this.getOutputs();

        const result = this.#circuit.run(inputs.map(node => node.getValue()));
        
        result.outputs.forEach((value, index) => {
            outputs[index].setValue(value);
        });

        this.log(LogLevel.DEBUG, `Subcircuit complete: [id = ${this.#circuit.getId()}, name = '${this.#circuit.getName()}']`, result);

        return result.propagationDelay;
    }
}