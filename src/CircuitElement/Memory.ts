import { BitString } from "../BitString";
import { CircuitBus } from "../CircuitBus";
import { CircuitElement } from "../CircuitElement";

export abstract class Memory extends CircuitElement {
  protected wordSize: number;
  protected data: BitString[];

  constructor(
    label: string,
    inputs: CircuitBus[],
    outputs: CircuitBus[],
    size: number,
    wordSize: number,
    initialData: BitString[],
  ) {
    super(label, inputs, outputs);

    this.wordSize = wordSize;
    this.data = new Array(size).fill(BitString.low(wordSize));
    initialData.forEach((value, index) => {
      this.data[index] = value.truncate(wordSize).pad(wordSize);
    });
  }

  read(address: number): BitString {
    return this.data[address];
  }

  write(address: number, value: BitString): void {
    this.data[address] = value.truncate(this.wordSize).pad(this.wordSize);
  }

  getWordSize(): number {
    return this.wordSize;
  }

  initialize(value: BitString): void {
    if (value.getWidth() % this.wordSize != 0) {
      throw new Error(
        `Memory initialization string must be a multiple of ${this.wordSize}; got ${value.getWidth()} bits.`,
      );
    }

    let i = 0;
    while (value.getWidth()) {
      const word = value.msb(this.wordSize);

      this.data[i] = word;

      value = value.truncate(value.getWidth() - this.wordSize);
      i++;
    }
  }
}
