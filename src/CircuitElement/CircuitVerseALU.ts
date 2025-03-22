import { BitString } from "../BitString";
import { CircuitBus } from "../CircuitBus";
import { CircuitElement } from "../CircuitElement";

export class CircuitVerseALU extends CircuitElement {

    constructor(a: CircuitBus, b: CircuitBus, control: CircuitBus, output: CircuitBus, carryOut: CircuitBus) {
        super('CircutVerseALUElement', [a, b, control], [output, carryOut]);
    }

    resolve(): number {
        const [a, b, control] = this.getInputs().map(o => o.getValue());
        const [output, carryOut] = this.getOutputs();

        if (!control || !a || !b) {
            return this.getPropagationDelay();
        }

        carryOut.setValue(BitString.low());

        switch (control.toString()) {
            case '000':
                output.setValue(a.and(b));
                break;
            case '001':
                output.setValue(a.or(b));
                break;
            case '010':
                // Pad with an extra bit to detect carry out.
                const addition = a.pad(a.getWidth() + 1)
                    .add(b.pad(b.getWidth() + 1));

                // Strip off carry out bit before setting sum.
                output.setValue(addition.substring(1));
                carryOut.setValue(addition.msb(1)); // Grab carry out bit only.
                break;
            case '100':
                output.setValue(a.and(b.not()));
                break;
            case '101':
                output.setValue(a.or(b.not()));
                break;
            case '110':
                output.setValue(a.sub(b));
                break;
            case '111':
                output.setValue(new BitString(a.lessThan(b) ? '1' : '0'));
                break;
            default:
                output.setValue(BitString.low());
                break;
        }

        return this.getPropagationDelay();
    }
}