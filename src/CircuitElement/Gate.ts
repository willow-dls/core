import { CircuitElement } from "../CircuitElement";
import { CircuitNode } from "../CircuitNode";

export abstract class Gate extends CircuitElement {
    constructor(inputs: CircuitNode[], outputs: CircuitNode[]) {
        super(inputs, outputs);
    }

    resolve(): number {
        const inputs = this.getInputs();
        const outputs = this.getOutputs();
        
        // We are ignoring Typescript here because it expects the return value
        // of reduce to be of the same type as the inputs, but this is not how we
        // are using this function. Everything is fine, there is no bug here, so we 
        // can safely ignore this. 
        // @ts-ignore
        const result: number = inputs.reduce((prev, cur) => this.evaluate(prev.getValue(), cur.getValue()));
        outputs.forEach(o => o.setValue(result));

        // TODO: The gate may have a custom propagation delay; we must support this.
        return 10;
    }

    abstract evaluate(previousValue: number, currentValue: number): number;
}