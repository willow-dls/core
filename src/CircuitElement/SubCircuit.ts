import { Circuit } from "../Circuit";
import { CircuitElement } from "../CircuitElement";
import { CircuitNode } from "../CircuitNode";

export class SubCircuit extends CircuitElement {
    #circuit: Circuit;
    
    constructor(circuit: Circuit, inputs: CircuitNode[], outputs: CircuitNode[]) {
        super(inputs, outputs);
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