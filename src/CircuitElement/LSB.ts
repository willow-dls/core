import { CircuitElement } from "../CircuitElement";
import { CircuitBus } from "../CircuitBus";
import { BitString } from "../BitString";
import { LogLevel } from "../CircuitLogger";

/**
 * The LSB element outputs the index of the least significant bit which is
 * set high on the input.
 */
export class LSB extends CircuitElement {
  /**
   * Create a new LSB element.
   * @param input The input bus.
   * @param output The output bus.
   * @param enable The enable output bus. If low, it means a significant bit was not
   * found in the input. If high, it means a significant bit was found. This is used
   * to distinguish the case where the least significant bit is at index zero (producing
   * an output of all zeros) as opposed to when there is actually no significant bit,
   * which will also produce an output of all zeros.
   */
  constructor(input: CircuitBus, output: CircuitBus, enable: CircuitBus) {
    super("LSBElement", [input], [output, enable]);
  }

  resolve(): number {
    const [input] = this.getInputs();
    const [output, enable] = this.getOutputs();

    const inputValue = input.getValue();

    if (!inputValue) {
      output.setValue(BitString.low());
      enable.setValue(BitString.low());
      return this.getPropagationDelay();
    }

    const inputString = inputValue.toString();
    const inputWidth = inputValue.getWidth();

    this.log(LogLevel.TRACE, `Input: [width=${inputWidth}] '${inputString}'`);

    for (let i = inputWidth - 1; i >= 0; i--) {
      if (inputString[i] == "1") {
        const lsb = new BitString((inputWidth - i - 1).toString(2), inputWidth);
        this.log(LogLevel.TRACE, `LSB found at index: '${lsb}'`);
        output.setValue(lsb);

        // Set ENABLE to HIGH if an LSB was found
        enable.setValue(BitString.high());

        return this.getPropagationDelay();
      }
    }

    this.log(LogLevel.TRACE, `No LSB found.`);
    output.setValue(BitString.low(inputWidth));
    enable.setValue(BitString.low());

    return this.getPropagationDelay();
  }
}
