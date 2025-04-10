import { BitString } from "../BitString";
import { CircuitBus } from "../CircuitBus";
import { CircuitElement } from "../CircuitElement";

/**
 * Represents a Power element in a circuit, which sets its output to a high value (logic 1).
 */
export class Power extends CircuitElement {
  /**
   * Creates an instance of the Power element.
   *
   * @param output The output bus that will be set to a high value.
   */
  constructor(output: CircuitBus) {
    super("PowerElement", [], [output]);
  }

  resolve(): number {
    this.getOutputs().forEach((o) => o.setValue(BitString.high(o.getWidth())));
    return this.getPropagationDelay();
  }
}
