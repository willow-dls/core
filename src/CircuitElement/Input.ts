import { CircuitElement } from "../CircuitElement";
import { CircuitBus } from "../CircuitBus";
import { BitString } from "../BitString";

export class Input extends CircuitElement {
    #index: number;
    #label: string;
    #value: BitString;

    constructor(index: number, label: string, outputs: CircuitBus[], initialValue: BitString = BitString.low()) {
        super('InputElement', [], outputs);
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

    setValue(value: BitString) {
        this.#value = value;
    }

    resolve(): number {
        const outputs = this.getOutputs();
        outputs.forEach(o => o.setValue(this.#value));
        return this.getPropagationDelay();
    }
}