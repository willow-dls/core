import { BitString } from "../BitString";
import { CircuitBus } from "../CircuitBus";
import { CircuitElement } from "../CircuitElement";

/**
 * The constant element accepts a hard-coded bit string value which it
 * continuously outputs to its output bus. It acts almost as a read-only
 * register or a single ROM value.
 */
export class Constant extends CircuitElement {
  #value: BitString;

  /**
   * Create a new constant element.
   * @param output The output bus onto which to place `value`.
   * @param value The value to output onto the output bus.
   */
  constructor(output: CircuitBus, value: BitString) {
    super("ConstantElement", [], [output]);
    this.#value = value;
  }

  resolve(): number {
    this.getOutputs().forEach((o) => o.setValue(this.#value));
    return this.getPropagationDelay();
  }
}
