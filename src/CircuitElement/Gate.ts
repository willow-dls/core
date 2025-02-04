import { CircuitElement } from "../CircuitElement";
import { CircuitNode } from "../CircuitNode";

export abstract class Gate extends CircuitElement {
    constructor(inputs: CircuitNode[], outputs: CircuitNode[]) {
        super(10, inputs, outputs);
    }

    run(inputs: CircuitNode[], outputs: CircuitNode[]): void {
        const result = inputs.reduce((prev, cur) => this.evaluate(prev, cur.getValue()), this.initialValue());
        outputs.forEach(o => o.setValue(result));
    }

    abstract initialValue(): number;
    abstract evaluate(previousValue: number, currentValue: number): number;
}