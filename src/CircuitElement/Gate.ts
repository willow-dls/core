import { CircuitElement } from "../CircuitElement";
import { CircuitNode } from "../CircuitNode";

export abstract class Gate extends CircuitElement {
    constructor(inputs: CircuitNode[], outputs: CircuitNode[]) {
        super(inputs, outputs);
    }

    resolve(): number {
        const inputs = this.getInputs();
        const outputs = this.getOutputs();

        const inputValues = inputs.map(i => i.getValue());
        const result: number = inputValues.length == 1 ? this.evaluate(0, inputValues[0]) : inputValues.slice(1).reduce((prev, cur) => this.evaluate(prev, cur), inputValues[0]);
        
        outputs.forEach(o => o.setValue(result));

        // TODO: The gate may have a custom propagation delay; we must support this.
        return 10;
    }

    abstract evaluate(previousValue: number, currentValue: number): number;
}