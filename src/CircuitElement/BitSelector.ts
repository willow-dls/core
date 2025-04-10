import { CircuitElement } from "../CircuitElement";
import { CircuitBus } from "../CircuitBus";
import { BitString } from "../BitString";
import { LogLevel } from "../CircuitLogger";

/**
 * A bit selector element which takes a single or multi-bit input and outputs
 * the bit that must be isolated using a single or multi-bit select line.
 * The select line value indicates the specific bit that must be isolated within
 * its body in decimal form.
 */
export class BitSelector extends CircuitElement {
  /**
   * Create a new bit selector element.
   * @param input The input bus.
   * @param output The output bus.
   * @param bitSelector The selector bus, which holds the index of the bit from the
   * input to pass to the output.
   */
  constructor(input: CircuitBus, output: CircuitBus, bitSelector: CircuitBus) {
    super("BitSelectorElement", [input, bitSelector], [output]);
  }

  resolve(): number {
    const [input, bitSelector] = this.getInputs();
    const [output] = this.getOutputs();

    const inputValue = input.getValue();
    const bitSelectorValue = bitSelector.getValue();

    if (!bitSelectorValue || !inputValue) {
      return this.getPropagationDelay();
    }

    const bitSelectorIndx = bitSelectorValue.toUnsigned();
    const inputWidth = inputValue.getWidth();

    output.setValue(
      new BitString(
        inputValue.toString()[Math.abs(bitSelectorIndx - inputWidth + 1)],
      ),
    );

    this.log(
      LogLevel.TRACE,
      `Input: [width=${inputWidth}] '${inputValue.toString()}'`,
    );

    return this.getPropagationDelay();
  }
}
