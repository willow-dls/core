import { CircuitElement } from "../CircuitElement";
import { CircuitNode } from "../CircuitNode";

export class Output extends CircuitElement {
    #index: number;
    #label: string;
    #value: number;

    constructor(index: number, label: string, input: CircuitNode) {
        super([input], []);
        this.#index = index;
        this.#label = label;
        this.#value = 0;
    }

    getIndex(): number {
        return this.#index;
    }

    getLabel(): string {
        return this.#label;
    }

    getValue(): number {
        return this.#value;
    }

    resolve(): number {
        const inputs = this.getInputs();
        // There is only ever one input for this circuit.
        inputs.forEach(i => this.#value = i.getValue());
        return 0;
    }
}