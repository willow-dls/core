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
    initialData: BitString[],
  ) {
    super("RAMElement", [address, input, write, reset], [output]);

    this.#wordSize = wordSize;
    this.#data = new Array(size).fill(BitString.low(wordSize));
    initialData.forEach((value, index) => {
      this.#data[index] = value.truncate(wordSize).pad(wordSize);
    });
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

  read(address: number): BitString {
    return this.#data[address];
  }

  write(address: number, value: BitString): void {
    this.#data[address] = value.truncate(this.#wordSize).pad(this.#wordSize);
  }

  getWordSize(): number {
    return this.#wordSize;
  }

  initialize(value: BitString): void {
    if (value.getWidth() % this.#wordSize != 0) {
      throw new Error(
        `RAM initialization string must be a multiple of ${this.#wordSize}; got ${value.getWidth()} bits.`,
      );
    }

    let i = 0;
    while (value.getWidth()) {
      const word = value.msb(this.#wordSize);

      this.#data[i] = word;

      value = value.truncate(value.getWidth() - this.#wordSize);
      i++;
    }
  }
}
