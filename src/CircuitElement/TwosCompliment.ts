import { CircuitBus } from "../CircuitBus";
import { CircuitElement } from "../CircuitElement";

/**
 * Represents a Two's Complement circuit element that computes the two's complement
 * of the input value and sets it to the output.
 */
export class TwosCompliment extends CircuitElement {
  /**
   * Creates an instance of the TwosCompliment circuit element.
   *
   * @param input The input `CircuitBus` providing the value to be complemented.
   * @param output The output `CircuitBus` where the complemented value will be set.
   */
  constructor(input: CircuitBus, output: CircuitBus) {
    super("TwosComplimentElement", [input], [output]);
  }

  resolve(): number {
    const [input] = this.getInputs();
    const [output] = this.getOutputs();

    output.setValue(input.getValue()?.twosCompliment() ?? null);

    return this.getPropagationDelay();
  }
}
