import { CircuitElement } from "../CircuitElement";
import { CircuitNode } from "../CircuitNode";

export class Input extends CircuitElement {
    #label: string;
    #value: number;

    constructor(label: string, outputs: CircuitNode[], initialValue: number = 0) {
        super(0, [], outputs);
        this.#value = initialValue;
        this.#label = label;
    }

    getLabel(): string {
        return this.#label;
    }

    setValue(value: number) {
        this.#value = value;
    }

    run(inputs: CircuitNode[], outputs: CircuitNode[]): void {
        outputs.forEach(o => o.setValue(this.#value));
    }
}