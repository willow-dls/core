import { BitString } from "../BitString";
import { CircuitBus } from "../CircuitBus";
import { CircuitElement } from "../CircuitElement";
import { LogLevel } from "../CircuitLogger";

export class Splitter extends CircuitElement {
    #split: number[];

    constructor(split: number[], input: CircuitBus, outputs: CircuitBus[]) {
        super('SplitterElement', [input], outputs);

        this.#split = split;
    }

    resolve(): number {
        const input: BitString = this.getInputs()[0].getValue();

        let off = 0;

        for (const i in this.#split) {
            const split = this.#split[i];
            const output = this.getOutputs()[i];

            this.log(LogLevel.TRACE, `Computing ${input}[${off}:${off + split}]...`);
            const value = input.substring(off, off + split);
            this.log(LogLevel.TRACE, `Got value: ${value}`);

            output.setValue(value);

            off += split;
        }

        // TODO: handle custom propagation delays.
        return 10;
    }
    
}