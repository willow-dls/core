import { BitString } from "../BitString";
import { CircuitBus } from "../CircuitBus";
import { CircuitElement } from "../CircuitElement";

export class Power extends CircuitElement {
    constructor(output: CircuitBus) {
        super('PowerElement', [], [output]);
    }

    resolve(): number {
        this.getOutputs().forEach(o => o.setValue(BitString.high(o.getWidth())));
        return this.getPropagationDelay();
    }
}