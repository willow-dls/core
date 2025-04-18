import { BitString } from "../BitString";
import { CircuitBus } from "../CircuitBus";
import { CircuitElement } from "../CircuitElement";

/**
 * The CircuitVerse ALU. This element implements CircuitVerse's ALU. Since each
 * simulator implements the ALU differently, we have separate implementations for
 * all the simulators we support. This ALU behaves exactly like the CircuitVerse
 * one, so refer to the [CircuitVerse ALU Documentation](https://docs.circuitverse.org/#/chapter4/8misc?id=alu)
 * for the opcodes and other usage information.
 */
export class CircuitVerseALU extends CircuitElement {
  /**
   * Create a new CircuitVerse ALU.
   * @param a The first ALU operand bus.
   * @param b The second ALU operand bus.
   * @param control The control signal bus.
   * @param output The output value bus.
   * @param carryOut The carry out bus.
   */
  constructor(
    a: CircuitBus,
    b: CircuitBus,
    control: CircuitBus,
    output: CircuitBus,
    carryOut: CircuitBus,
  ) {
    super("CircutVerseALUElement", [a, b, control], [output, carryOut]);
  }

  resolve(): number {
    const [a, b, control] = this.getInputs().map((o) => o.getValue());
    const [output, carryOut] = this.getOutputs();

    if (!control || !a || !b) {
      return this.getPropagationDelay();
    }

    carryOut.setValue(BitString.low());

    switch (control.toString()) {
      case "000":
        output.setValue(a.and(b));
        break;
      case "001":
        output.setValue(a.or(b));
        break;
      case "010":
        // Pad with an extra bit to detect carry out.
        const addition = a.pad(a.getWidth() + 1).add(b.pad(b.getWidth() + 1));

        // Strip off carry out bit before setting sum.
        output.setValue(addition.substring(1));
        carryOut.setValue(addition.msb(1)); // Grab carry out bit only.
        break;
      case "100":
        output.setValue(a.and(b.not()));
        break;
      case "101":
        output.setValue(a.or(b.not()));
        break;
      case "110":
        output.setValue(a.sub(b));
        break;
      case "111":
        output.setValue(new BitString(a.lessThan(b) ? "1" : "0"));
        break;
      default:
        output.setValue(BitString.low());
        break;
    }

    return this.getPropagationDelay();
  }
}
