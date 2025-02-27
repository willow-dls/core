import { CircuitElement } from "../CircuitElement";

export class LSB extends CircuitElement {
  #bitstring: string;

  constructor(bitstring: string) {
    super();
    this.#bitstring = bitstring;
  }

  resolve(): number {
    return parseInt(this.#bitstring, 2) & 1;
  }
}
