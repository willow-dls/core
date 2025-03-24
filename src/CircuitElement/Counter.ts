import { BitString } from "../BitString";
import { CircuitBus } from "../CircuitBus";
import { LogLevel } from "../CircuitLogger";
import { SequentialElement } from "./SequentialElement";

export class Counter extends SequentialElement {

    constructor(maxValue: CircuitBus, clock: CircuitBus, reset: CircuitBus, output: CircuitBus, zero: CircuitBus) {
        super('CounterElement', clock, [maxValue, reset], [output, zero]);
    }

    // resolve() is called whenever an input changes, either the maxValue, clock, or reset line.
    onResolve(): void {
        const [clock, maxValue, reset] = this.getInputs();
        const [output, zero] = this.getOutputs();

        this.log(LogLevel.TRACE, `Before resolve():`, {
            maxValue: maxValue.getValue(),
            reset: reset.getValue(),
            output: output.getValue(),
            zero: zero.getValue()
        });

        // If reset is high, zero the output
        if (reset.getValue()?.equals('1')) {
            this.log(LogLevel.TRACE, `Reset is high, zeroing output...`);
            output.setValue(BitString.low());
        }

        this.log(LogLevel.TRACE, `After resolve():`, {
            maxValue: maxValue.getValue(),
            reset: reset.getValue(),
            output: output.getValue(),
            zero: zero.getValue()
        });
    }

    onClockRise(): void {
        const [clock, maxValue] = this.getInputs();
        const [output, zero] = this.getOutputs();

        // If the current value is greater than the max value, reset to zero
        if (output.getValue()?.greaterThan(maxValue.getValue())) {
            this.log(LogLevel.TRACE, `Counter value exceeded max value, zeroing...`);
            output.setValue(BitString.low());
            zero.setValue(BitString.high());
        } else {
            const one = new BitString('1', output.getWidth());
            const current = output.getValue() ?? BitString.low(output.getWidth());

            this.log(LogLevel.TRACE, `Rising edge of clock: ${current} + ${one} => ${current.add(one)}`);

            output.setValue(current.add(one));
            zero.setValue(BitString.low());

            this.log(LogLevel.TRACE, `New Value: ${output.getValue()}`);
        }
    }

    onClockFall(): void {
        
    }

    reset(): void {
        super.reset();
        
        const [output] = this.getOutputs();
        output.setValue(BitString.low(output.getWidth()));
        //this.getOutputs().forEach(o => o.setValue(BitString.low()));
    }
}