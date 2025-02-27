import { CircuitElement } from "../CircuitElement";
import { CircuitBus } from "../CircuitBus";

export class Input extends CircuitElement {
    #index: number;
    #label: string;
    #value: number;

    constructor(index: number, label: string, outputs: CircuitBus[], initialValue: number = 0) {
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

    resolve(): number {
        const outputs = this.getOutputs();
        outputs.forEach(o => o.setValue(this.#value));
        return 0;
    }
}