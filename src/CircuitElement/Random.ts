import { BitString } from "../BitString";
import { CircuitBus } from "../CircuitBus";
import { SequentialElement } from "./SequentialElement";

export class Random extends SequentialElement {
    constructor(maxValue: CircuitBus, clock: CircuitBus, output: CircuitBus) {
        super('RandomElement', clock, [maxValue], [output]);
    }

    onResolve(): void {
        const [clock, maxValue] = this.getInputs();
        const [output] = this.getOutputs();

        // If the current value is greater than the max value, reset to zero, regardless of what
        // the clock reads.
        // This is an odd behavior of the CircuitVerse circuit which we reproduce here.
        // My hunch is that their code is doing a check similar to this one to know when to
        // roll the counter over without checking the clock. So we do this before we check the
        // clock.
        if (output.getValue()?.greaterThan(maxValue.getValue())) {
            output.setValue(BitString.low());
        }
    }

    onClockRise(): void {
        const [clock, maxValue] = this.getInputs();
        const [output] = this.getOutputs();
        
        let rand;

        do {
            // TODO: Could potentially be very inefficient to compute random
            // numbers this way, but it was easy. Should optimize this at some
            // point though.
            rand = BitString.rand(output.getWidth());
        } while (rand.greaterThan(maxValue.getValue()));
        
        output.setValue(rand);
    }

    onClockFall(): void {

    }
}