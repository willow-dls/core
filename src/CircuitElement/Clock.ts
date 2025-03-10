import { BitString } from "../BitString";
import { CircuitBus } from "../CircuitBus";
import { CircuitElement } from "../CircuitElement";

export class Clock extends CircuitElement {
    #value: BitString;

    constructor(output: CircuitBus) {
        super('ClockElement', [], [output]);

        this.#value = BitString.low();
    }

    resolve(): number {
        const [output] = this.getOutputs();
        output.setValue(this.#value);
        
        return 10; // TODO: Custom propagation delay.
    }

    setHigh(): void {
        this.#value = BitString.high();
    }

    setLow(): void {
        this.#value = BitString.low();
    }

    tick(): void {
        if (this.#value.equals(BitString.low())) {
            this.setHigh();
        } else {
            this.setLow();
        }
    }
}