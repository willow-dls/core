import { BitString } from "../BitString";
import { CircuitBus } from "../CircuitBus";
import { SequentialElement } from "./SequentialElement";

export class JKFlipFlop extends SequentialElement {
    constructor(
        clock: CircuitBus, 
        j: CircuitBus,
        k: CircuitBus,
        q: CircuitBus, 
        qInv: CircuitBus, 
        reset: CircuitBus, 
        preset: CircuitBus, 
        enable: CircuitBus
    ) {
        super('JKFlipFlopElement', clock, [j, k, reset, preset, enable], [q, qInv]);
    }

    onClockRise(): void {
        const [clock, j, k, reset, preset, enable] = this.getInputs();
        const [q, qInv] = this.getOutputs();

        if (enable.getValue()?.equals(BitString.high())) {
            if (!q.getValue()) {
                q.setValue(BitString.low());
            }

            if (j.getValue()?.equals(BitString.high()) && k.getValue()?.equals(BitString.high())) {
                // If both J and K are high, flip-flop
                q.setValue(q.getValue()?.not() ?? null);
            } else if (j.getValue()?.equals(BitString.high())) {
                // J is high, set q high.
                q.setValue(j.getValue());
            } else if (k.getValue()?.equals(BitString.high())) {
                // K is high, set q low.
                q.setValue(k.getValue()?.not() ?? null);
            }
        } 
    }

    onResolve(): void {
        const [clock, j, k, reset, preset, enable] = this.getInputs();
        const [q, qInv] = this.getOutputs();

        if (reset.getValue()?.equals(BitString.high())) {
            q.setValue(preset.getValue());
        }

        qInv.setValue(q.getValue()?.not() ?? null);
    }
    
    onClockFall(): void {
        
    }
}