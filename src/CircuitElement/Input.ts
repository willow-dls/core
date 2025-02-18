import { CircuitElement } from "../CircuitElement";
import { CircuitNode } from "../CircuitNode";

export class Input extends CircuitElement {
    #index: number;
    #label: string;
    #value: number;

    constructor(index: number, label: string, outputs: CircuitNode[], initialValue: number = 0) {
        super([], outputs);
        this.#index = index;
        this.#value = initialValue;
        this.#label = label;
    }

    getIndex(): number {
        return this.#index;
    }

    getLabel(): string {
        return this.#label;
    }

    setValue(value: number) {
        this.#value = value;
    }

    run(inputs: CircuitNode[], outputs: CircuitNode[]): number {
        outputs.forEach(o => o.setValue(this.#value));
        return 0;
    }
}