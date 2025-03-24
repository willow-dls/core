import { BitString } from "../BitString";
import { CircuitBus } from "../CircuitBus";
import { CircuitElement } from "../CircuitElement";

export class SRFlipFlop extends CircuitElement {

    constructor(
        s: CircuitBus,
        r: CircuitBus,
        q: CircuitBus,
        qInv: CircuitBus,
        reset: CircuitBus,
        preset: CircuitBus,
        enable: CircuitBus) {
        super('SRFlipFlopElement', [s, r, reset, preset, enable], [q, qInv]);
    }

    resolve(): number {
        const [s, r, reset, preset, enable] = this.getInputs();
        const [q, qInv] = this.getOutputs();

        // Only use S and R if Enable is high.
        if (enable.getValue()?.equals(BitString.high())) {
            const sHigh = s.getValue()?.equals(BitString.high());
            const rHigh = r.getValue()?.equals(BitString.high());

            // If S or R is high (but not both), then set Q to the value of
            // S (either high or low.) Otherwise, do nothing.
            if ((sHigh && !rHigh) || (!sHigh && rHigh)) {
                q.setValue(s.getValue());
            }
        }

        // Regardless of whatever else happened above, if reset is high, pass
        // the preset value through.
        if (reset.getValue()?.equals(BitString.high())) {
            q.setValue(preset.getValue());
        }

        qInv.setValue(q.getValue()?.not() ?? null);
        return this.getPropagationDelay();
    }
    
}