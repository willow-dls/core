import { BitString } from "../BitString";
import { CircuitBus } from "../CircuitBus";
import { CircuitElement } from "../CircuitElement";

export class RAM extends CircuitElement {
    #data: BitString[];
    #wordSize: number;

    constructor(
        address: CircuitBus,
        input: CircuitBus,
        write: CircuitBus,
        reset: CircuitBus,
        output: CircuitBus,
        size: number,
        wordSize: number,
        initialData: BitString[]) {
        super('RAMElement', [address, input, write, reset], [output]);

        this.#wordSize = wordSize;
        this.#data = new Array(size).fill(BitString.low(wordSize));
        initialData.forEach((value, index) => {
            this.#data[index] = value.truncate(wordSize).pad(wordSize);
        })
    }

    resolve(): number {
        const [address, input, write, reset] = this.getInputs();
        const [output] = this.getOutputs();

        if (BitString.high().equals(reset.getValue())) {
            this.#data = this.#data.fill(BitString.low(this.#wordSize));
            output.setValue(BitString.low(this.#wordSize));
        } else {
            const idx = address.getValue()?.toUnsigned();
            if (idx) {
                if (BitString.high().equals(write.getValue())) {
                    this.#data[idx] = input.getValue() ?? BitString.low(this.#wordSize);
                }

                output.setValue(this.#data[idx]);
            }
        }

        return this.getPropagationDelay();
    }
}