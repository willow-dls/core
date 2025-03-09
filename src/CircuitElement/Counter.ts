import { BitString } from "../BitString";
import { CircuitBus } from "../CircuitBus";
import { CircuitElement } from "../CircuitElement";

export class Counter extends CircuitElement {
    #lastClock: BitString | null;

    constructor(maxValue: CircuitBus, clock: CircuitBus, reset: CircuitBus, output: CircuitBus, zero: CircuitBus) {
        super('CounterElement', [maxValue, clock, reset], [output, zero]);
        
        this.#lastClock = null;
    }

    // resolve() is called whenever an input changes, either the maxValue, clock, or reset line.

    resolve(): number {
        const [maxValue, clock, reset] = this.getInputs();
        const [output, zero] = this.getOutputs();

        if (!this.#lastClock) {
            this.#lastClock = clock.getValue();
        }

        // The "zero" line on a Counter always outputs a single bit zero. I'm not sure why
        // the creators of circuitverse felt the need to design this element to do that, but it's
        // easy enough to implement.
        zero.setValue(BitString.low());

        // If reset is high, zero the output
        if (reset.getValue().equals('1')) {
            output.setValue(BitString.low(output.getValue().getWidth()));
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
            output.setValue(output.getValue().add(new BitString('1', output.getValue().getWidth())));
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