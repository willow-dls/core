import { BitString } from "../BitString";
import { CircuitBus } from "../CircuitBus";
import { CircuitElement } from "../CircuitElement";
import { LogLevel } from "../CircuitLogger";

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

  read(address: number, length: number = 1): BitString[] {
    return this.data.slice(address, length);
  }

  write(address: number, value: BitString[]): void {
    const words = value.map((v) =>
      v.truncate(this.wordSize).pad(this.wordSize),
    );
    this.data.splice(address, words.length, ...words);
    this.log(
      LogLevel.TRACE,
      `Write: addr = ${address}, len = ${value.length}, words = ${value.map((d) => d.toString())}`,
    );
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
