import { Circuit } from "../Circuit";
import { CircuitElement } from "../CircuitElement";
import { CircuitNode } from "../CircuitNode";

export class SubCircuit extends CircuitElement {
    constructor(circuit: Circuit, inputs: CircuitNode[], outputs: CircuitNode[]) {
        // TODO: Propagation delay should match that of the sub circuit.
        super(0, inputs, outputs);
    }
    run(inputs: CircuitNode[], outputs: CircuitNode[]): void {
        throw new Error("Method not implemented.");
    }
    
}