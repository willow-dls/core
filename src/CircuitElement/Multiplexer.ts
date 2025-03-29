import { BitString } from "../BitString";
import { CircuitElement } from "../CircuitElement";
import { CircuitBus } from "../CircuitBus";
import { Circuit } from "../Circuit";

/**
 * A class representing a multiplexer circuit element.
 *
 * The multiplexer selects one of the input buses based on the control signal and sets it to the output bus.
 */
export class Multiplexer extends CircuitElement {
  #controlSignal: CircuitBus;

  /**
   * Creates an instance of a multiplexer.
   *
   * @param inputs An array of input circuit buses for the multiplexer.
   * @param outputs An array of output circuit buses for the multiplexer.
   * @param controlSignal A control signal circuit bus that determines which input to select.
   */
  constructor(
    inputs: CircuitBus[],
    outputs: CircuitBus[],
    controlSignal: CircuitBus,
  ) {
    super("MultiplexerElement", inputs, outputs);

    this.#controlSignal = controlSignal;
  }

  resolve(): number {
    const inputs = this.getInputs();
    const [output] = this.getOutputs();

    const controlValue = this.#controlSignal.getValue();

    if (!controlValue) {
      return this.getPropagationDelay();
    }

    const controlSignalVal = controlValue.toUnsigned();

    if (controlSignalVal >= inputs.length) {
      throw new Error(
        `Multiplexer control signal is set to '${controlSignalVal}', but only has ${inputs.length} inputs.`,
      );
    } else {
      output.setValue(inputs[controlSignalVal].getValue());
    }

    return this.getPropagationDelay();
  }
}
