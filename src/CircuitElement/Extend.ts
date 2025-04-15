import { CircuitBus } from "../CircuitBus";
import { CircuitElement } from "../CircuitElement";

export class Extend extends CircuitElement {
    constructor(input: CircuitBus, outputs: CircuitBus[]) {
        super('ExtendElement', [input], outputs);
    }

    resolve(): number {
        const [input] = this.getInputs();

        for (const output of this.getOutputs()) {
            output.setValue(input.getValue());
        }

        return this.getPropagationDelay();
    }
}