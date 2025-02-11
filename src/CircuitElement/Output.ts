import { CircuitElement } from "../CircuitElement";
import { CircuitNode } from "../CircuitNode";

export class Output extends CircuitElement {
    #index: number;
    #label: string;
    #value: number | undefined;

    constructor(index: number, label: string, input: CircuitNode) {
        super([input], []);
        this.#index = index;
        this.#label = label;
    }

    getIndex(): number {
        return this.#index;
    }

    getLabel(): string {
        return this.#label;
    }

    getValue(): number | undefined {
        return this.#value;
    }

    run(inputs: CircuitNode[], outputs: CircuitNode[]): number {
        // There is only ever one input for this circuit.
        inputs.forEach(i => this.#value = i.getValue());
        return 0;
    }
}