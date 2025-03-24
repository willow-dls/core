import { CircuitBus } from "../CircuitBus";
import { CircuitElement } from "../CircuitElement";

export class Adder extends CircuitElement {
  constructor(
    a: CircuitBus,
    b: CircuitBus,
    carryIn: CircuitBus,
    sum: CircuitBus,
    carryOut: CircuitBus,
  ) {
    super("AdderElement", [a, b, carryIn], [sum, carryOut]);
  }

  resolve(): number {
    const [a, b, carryIn] = this.getInputs();
    const [sum, carryOut] = this.getOutputs();

    const valA = a.getValue();
    const valB = b.getValue();
    const valC = carryIn.getValue();

    if (!valA || !valB || !valC) {
      // Values aren't on the line, can't reasonably do any computation.
      return this.getPropagationDelay();
    }

    // Pad with an extra bit to detect carry out.
    const addition = valA
      .pad(valA.getWidth() + 1)
      .add(valB.pad(valB.getWidth() + 1))
      .add(valC.pad(valA.getWidth() + 1)); // Pad carry in to width of other operands.

    // Strip off carry out bit before setting sum.
    sum.setValue(addition.substring(1));
    carryOut.setValue(addition.msb(1)); // Grab carry out bit only.

    return this.getPropagationDelay();
  }
}
