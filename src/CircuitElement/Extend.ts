import { CircuitBus } from "../CircuitBus";
import { CircuitElement } from "../CircuitElement";

/**
 * The Extender is what JLS calls a "make N copies" element. It simply takes
 * an input and duplicates it to all of the connected outputs. This is pretty
 * much identical to a {@link BufferGate}, and indeed could probably be implemented
 * using that element.
 */
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