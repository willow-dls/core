import { CircuitElement } from "../CircuitElement";
import { CircuitBus } from "../CircuitBus";
import { BitString } from "../BitString";

export class Output extends CircuitElement {
    #index: number;
    #label: string;
    #value: BitString;

    constructor(index: number, label: string, input: CircuitBus) {
        super([input], []);
        this.#index = index;
        this.#label = label;
        this.#value = BitString.from('0');
    }

    getIndex(): number {
        return this.#index;
    }

    getLabel(): string {
        return this.#label;
    }

    setValue(value: BitString) {
        this.#value = value;

        const inputs = this.getInputs();
        inputs.forEach(i => i.setValue(value));
    }

    getValue(): BitString {
        return this.#value;
    }

    resolve(): number {
        const inputs = this.getInputs();
        // There is only ever one input for this circuit.
        //inputs.forEach(i => i.setValue(this.#value));
        inputs.forEach(i => this.#value = i.getValue());
        return 0;
    }

    getOutputs(): CircuitBus[] {
        return this.getInputs();
    }
}