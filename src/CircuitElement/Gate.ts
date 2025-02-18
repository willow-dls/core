import { CircuitElement } from "../CircuitElement";
import { CircuitNode } from "../CircuitNode";

export abstract class Gate extends CircuitElement {
    constructor(inputs: CircuitNode[], outputs: CircuitNode[]) {
        super(inputs, outputs);
    }

    run(inputs: CircuitNode[], outputs: CircuitNode[]): number {
        const result = inputs.reduce((prev, cur) => this.evaluate(prev, cur.getValue()), this.initialValue());
        outputs.forEach(o => o.setValue(result));

        // TODO: The gate may have a custom propagation delay; we must support this.
        return 10;
    }

    abstract initialValue(): number;
    abstract evaluate(previousValue: number, currentValue: number): number;
}