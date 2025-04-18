import { CircuitElement } from "../CircuitElement";
import { CircuitBus } from "../CircuitBus";
import { BitString } from "../BitString";
import { LogLevel } from "../CircuitLogger";

/**
 * Decoder is a class representing a priority decoder, which takes an input bus and outputs
 * a corresponding output bus where only one output is set to high (1) based on the input value,
 * and all other outputs are set to low (0).
 */
export class Decoder extends CircuitElement {
  /** The width of the enable input for the decoder. */
  readonly ENABLE_WIDTH: number = 1;

  /**
   * Creates an instance of the `Decoder` class.
   *
   * @param input The input bus which provides the signal to decode.
   * @param output An array of bus elements representing the decoder's output.
   */
  constructor(input: CircuitBus, output: CircuitBus[]) {
    super("PriorityEncoderElement", [input], output);
  }

  resolve(): number {
    const [input] = this.getInputs();
    const output = this.getOutputs();
    const inputValue = input.getValue();

    if (!inputValue) {
      // If the input is not available, set all outputs to low
      for (let i = 0; i < output.length; i++) {
        output[i].setValue(BitString.low());
      }
      return this.getPropagationDelay();
    }

    const inputString = inputValue.toString();
    const inputWidth = input.getWidth();
    const inputNum = inputValue.toUnsigned();
    this.log(LogLevel.TRACE, `Input: [width=${inputWidth}] '${inputString}'`);

    // Set the output corresponding to the input value to high and others to low
    for (let i = 0; i < output.length; i++) {
      if (i == inputNum) {
        output[i].setValue(BitString.high());
      } else {
        output[i].setValue(BitString.low());
      }
    }

    return this.getPropagationDelay();
  }
}
