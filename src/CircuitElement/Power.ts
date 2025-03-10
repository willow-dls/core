import { CircuitElement } from "../CircuitElement";
import { CircuitBus } from "../CircuitBus";
import { BitString } from "../BitString";

export class Power extends CircuitElement {
    #value: BitString;

    constructor(outputs: CircuitBus[]) {
        super('InputElement', [], outputs);
        this.#value = new BitString('1');
    }


    resolve(): number {
        const outputs = this.getOutputs();
        outputs.forEach(o => o.setValue(this.#value));
        return 0;
    }
}