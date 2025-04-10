import { BitString } from "../BitString";
import { CircuitBus } from "../CircuitBus";
import { CircuitElement } from "../CircuitElement";

/**
 * Represents a Ground element in a circuit, which sets its output to a low value (logic 0).
 */
export class Ground extends CircuitElement {
  /**
   * Creates an instance of the Ground element.
   *
   * @param output The output bus that will be set to a low value.
   */
  constructor(output: CircuitBus) {
    super("GroundElement", [], [output]);
  }

  resolve(): number {
    this.getOutputs().forEach((o) => o.setValue(BitString.low()));
    return this.getPropagationDelay();
  }
}
