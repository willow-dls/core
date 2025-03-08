import { BitString } from "../BitString";
import { CircuitBus } from "../CircuitBus";
import { CircuitElement } from "../CircuitElement";
import { LogLevel } from "../CircuitLogger";

export class Splitter extends CircuitElement {
    #split: number[];
    #prevInput: BitString;
    #prevOutputs: BitString[];

    #bitStringsEqual(a: BitString[], b: BitString[]): boolean {
        if (a === b) return true;
        if (a == null || b == null) return false;
        if (a.length !== b.length) return false;

        for (var i = 0; i < a.length; ++i) {
            if (!a[i].equals(b[i])) return false;
        }
        return true;
    }

    constructor(split: number[], input: CircuitBus, outputs: CircuitBus[]) {
        // This is a bi-directional element, so it's behavior depends on whether
        // the input changed (split input into outputs) or an output changed (combine
        // outputs into input.)
        // Therefore, both the inputs and outputs function as the other as well
        // and must be connected as such so that resolve() is called when either
        // the inputs OR the outputs change. We will detect which happened in
        // the abomination which is below.
        super('SplitterElement', [input, ...outputs], [input, ...outputs]);

        this.#split = split;
        this.#prevInput = input.getValue();
        this.#prevOutputs = outputs.map(o => o.getValue());
    }

    resolve(): number {
        const input: BitString = this.getInputs()[0].getValue();
        const outputs: BitString[] = this.getOutputs().slice(1).map(o => o.getValue());

        if (!input.equals(this.#prevInput) && this.#bitStringsEqual(this.#prevOutputs, outputs)) {
            this.log(LogLevel.TRACE, 'Input changed and outputs have not; splitting input into outputs...');
            let off = 0;

            for (const i in this.#split) {
                const split = this.#split[i];
                const output = this.getOutputs().slice(1)[i];

                this.log(LogLevel.TRACE, `Computing ${input}[${off}:${off + split}]...`);
                const value = input.substring(off, off + split);
                this.log(LogLevel.TRACE, `Got value: ${value}`);

                output.setValue(value);

                off += split;
            }
        } else if (input.equals(this.#prevInput) && !this.#bitStringsEqual(this.#prevOutputs, outputs)) {
            this.log(LogLevel.TRACE, 'Outputs have changed and input has not; combining outputs into input...');
            let newOut = '';

            for (const i in this.#split) {
                const split = this.#split[i];
                const output = this.getOutputs().slice(1)[i].getValue();

                if (output.getWidth() != split) {
                    throw new Error(`SplitterElement bus width error: Received ${output.getWidth()}-bit value on ${split}-bit bus.`);
                }

                newOut += output.toString();
            }

            this.log(LogLevel.TRACE, `Propagating '${newOut}' to input.`);
            this.getInputs()[0].setValue(new BitString(newOut));
        } else if (input.equals(this.#prevInput) && this.#bitStringsEqual(this.#prevOutputs, outputs)) {
            this.log(LogLevel.TRACE, 'Neither the input nor the outputs have changed; doing nothing...');
        } else {
            throw new Error(`SplitterElement contention: Both input and output changed, unable to resolve: '${this.#prevInput}' != '${input}' && ${this.#prevOutputs} != ${outputs}`);
        }

        this.#prevInput = input;
        this.#prevOutputs = outputs;

        // TODO: handle custom propagation delays.
        return 10;
    }

    reset() {
        const input: BitString = this.getInputs()[0].getValue();
        const outputs: BitString[] = this.getOutputs().slice(1).map(o => o.getValue());

        this.#prevInput = input;
        this.#prevOutputs = outputs;
    }
}