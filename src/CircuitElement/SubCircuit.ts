import { Circuit } from "../Circuit";
import { CircuitElement } from "../CircuitElement";
import { CircuitBus } from "../CircuitBus";

export class SubCircuit extends CircuitElement {
    #circuit: Circuit;
    
    constructor(circuit: Circuit, inputs: CircuitBus[], outputs: CircuitBus[]) {
        super('SubCircuitElement', inputs, outputs);
        this.#circuit = circuit;
    }

    resolve(): number {
        const inputs = this.getInputs();
        const outputs = this.getOutputs();

        const result = this.#circuit.run(inputs.map(node => node.getValue()));
        
        result.outputs.forEach((value, index) => {
            outputs[index].setValue(value);
        });

        return result.propagationDelay;
    }
}