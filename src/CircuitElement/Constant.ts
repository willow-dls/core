import { BitString } from "../BitString";
import { CircuitBus } from "../CircuitBus";
import { CircuitElement } from "../CircuitElement";

export class Constant extends CircuitElement {
  #value: BitString;

  constructor(output: CircuitBus, value: BitString) {
    super("ConstantElement", [], [output]);
    this.#value = value;
  }

  resolve(): number {
    this.getOutputs().forEach((o) => o.setValue(this.#value));
    return this.getPropagationDelay();
  }
}
