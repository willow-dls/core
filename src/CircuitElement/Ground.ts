import { CircuitElement } from "../CircuitElement";
import { CircuitBus } from "../CircuitBus";
import { BitString } from "../BitString";

export class Ground extends CircuitElement {
    #label: string;
    #value: BitString;

    constructor(label: string, outputs: CircuitBus[]) {
        super('InputElement', [], outputs);
        this.#value = new BitString('0');
        this.#label = label;
    }

    getLabel(): string {
        return this.#label;
    }

    resolve(): number {
        const outputs = this.getOutputs();
        outputs.forEach(o => o.setValue(this.#value));
        return 0;
    }
}