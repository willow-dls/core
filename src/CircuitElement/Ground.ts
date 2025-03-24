import { BitString } from "../BitString";
import { CircuitBus } from "../CircuitBus";
import { CircuitElement } from "../CircuitElement";

export class Ground extends CircuitElement {
  constructor(output: CircuitBus) {
    super("GroundElement", [], [output]);
  }

  resolve(): number {
    this.getOutputs().forEach((o) => o.setValue(BitString.low()));
    return this.getPropagationDelay();
  }
}
