import { CircuitElement } from "../CircuitElement";
import { CircuitNode } from "../CircuitNode";

export class Output extends CircuitElement {
    #label: string;
    #value: number | undefined;

    constructor(label: string, input: CircuitNode) {
        super(0, [input], []);
        this.#label = label;
    }

    getLabel(): string {
        return this.#label;
    }

    getValue(): number | undefined {
        return this.#value;
    }

    run(inputs: CircuitNode[], outputs: CircuitNode[]): void {
        // There is only ever one input for this circuit.
        inputs.forEach(i => this.#value = i.getValue());
    }
}