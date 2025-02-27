import { CircuitElement } from "../CircuitElement";

export class Multiplexer extends CircuitElement {
  #inputA: number;
  #inputB: number;
  #signal: number;

  constructor(signal: number, inputA: number, inputB: number) {
    super();
    this.#inputA = inputA;
    this.#inputB = inputB;
    this.#signal = signal;
  }

  resolve(): number {
    return (
      Number(this.#inputA && !this.#signal) ||
      Number(this.#inputB && this.#signal)
    );
  }
}
