import { BitString } from "../BitString";
import { CircuitBus } from "../CircuitBus";
import { CircuitElement } from "../CircuitElement";
import { LogLevel } from "../CircuitLogger";

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

        this.log(LogLevel.TRACE, `resolve():`, {
            maxValue: maxValue.getValue(),
            lastClock: this.#lastClock,
            clock: clock.getValue(),
            reset: reset.getValue(),
            output: output.getValue(),
            zero: output.getValue()
        });

        if (!this.#lastClock) {
            this.log(LogLevel.TRACE, 'No previous clock value, setting to current.');
            this.#lastClock = BitString.low();
        }

        // If reset is high, zero the output
        if (reset.getValue().equals('1')) {
            this.log(LogLevel.TRACE, `Reset is high, zeroing output...`);
            output.setValue(BitString.low(output.getValue().getWidth()));
        }

        // Now we check the clock to know if we need to increment the output line.
        // We only increment the output value on the rising edge of the clock; that is,
        // the clock was previously low and now it is high.
        if (this.#lastClock.equals('0') && clock.getValue().equals('1')) {
            // If the current value is greater than the max value, reset to zero
            if (output.getValue().greaterThan(maxValue.getValue())) {
                this.log(LogLevel.TRACE, `Counter value exceeded max value, zeroing...`);
                output.setValue(BitString.low(output.getValue().getWidth()));
                zero.setValue(BitString.high());
            } else {
                const one = new BitString('1', output.getValue().getWidth());
                const current = output.getValue();
    
                this.log(LogLevel.TRACE, `Rising edge of clock: ${current} + ${one} => ${current.add(one)}`);
    
                output.setValue(current.add(one));
                zero.setValue(BitString.low());
    
                this.log(LogLevel.TRACE, `New Value: ${output.getValue()}`);
            }
        }

        // Save the last clock value.
        this.#lastClock = clock.getValue();

        return 10; // TODO: Custom propagation delay.
    }

    reset(): void {
        super.reset();

        this.#lastClock = null;
        this.getOutputs().forEach(o => o.setValue(BitString.low(o.getValue().getWidth())));
    }
}