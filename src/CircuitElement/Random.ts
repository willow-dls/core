import { BitString } from "../BitString";
import { CircuitBus } from "../CircuitBus";
import { CircuitElement } from "../CircuitElement";

export class Random extends CircuitElement {
    #lastClock: BitString | null;

    constructor(maxValue: CircuitBus, clock: CircuitBus, output: CircuitBus) {
        super('RandomElement', [maxValue, clock], [output]);
        
        this.#lastClock = null;
    }

    resolve(): number {
        const [maxValue, clock] = this.getInputs();
        const [output] = this.getOutputs();

        if (!this.#lastClock) {
            this.#lastClock = clock.getValue();
        }

        // If the current value is greater than the max value, reset to zero, regardless of what
        // the clock reads.
        // This is an odd behavior of the CircuitVerse circuit which we reproduce here.
        // My hunch is that their code is doing a check similar to this one to know when to
        // roll the counter over without checking the clock. So we do this before we check the
        // clock.
        if (output.getValue().greaterThan(maxValue.getValue())) {
            output.setValue(BitString.low(output.getValue().getWidth()));
        }

        // Now we check the clock to know if we need to increment the output line.
        // We only increment the output value on the rising edge of the clock; that is,
        // the clock was previously low and now it is high.
        if (this.#lastClock.equals('0') && clock.getValue().equals('1')) {
            let rand;

            do {
                // TODO: Could potentially be very inefficient to compute random
                // numbers this way, but it was easy. Should optimize this at some
                // point though.
                rand = BitString.rand(output.getValue().getWidth());
            } while (rand.greaterThan(maxValue.getValue()));
            
            output.setValue(rand);
        }

        // Save the last clock value.
        this.#lastClock = clock.getValue();

        return 10; // TODO: Custom propagation delay.
    }

    reset(): void {
        super.reset();

        this.#lastClock = null;
    }
}