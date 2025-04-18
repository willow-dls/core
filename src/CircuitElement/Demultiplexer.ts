import { CircuitElement } from "../CircuitElement";
import { CircuitBus } from "../CircuitBus";
import { BitString } from "../BitString";

/**
 * A Demultiplexer element for routing a signal to one of many outputs based on a control signal.
 * This class extends from the `CircuitElement` and processes input and output values based on a control signal.
 *
 * @extends CircuitElement
 */
export class Demultiplexer extends CircuitElement {
  #controlSignal: CircuitBus;

  /**
   * Creates an instance of a Demultiplexer element.
   *
   * @param inputs The input buses.
   * @param outputs The output buses.
   * @param controlSignal The control signal bus used to determine which output will receive the input value.
   */
  constructor(
    inputs: CircuitBus[],
    outputs: CircuitBus[],
    controlSignal: CircuitBus,
  ) {
    super("DemultiplexerElement", inputs, outputs);

    this.#controlSignal = controlSignal;
  }

  resolve(): number {
    const inputs = this.getInputs();
    const outputs = this.getOutputs();

    const inputValue = inputs[0].getValue();
    const controlValue = this.#controlSignal.getValue();

    // If input or control signal is not active, don't do anything
    if (!inputValue || !controlValue) {
      return this.getPropagationDelay();
    }

    const outputWidth = inputValue.getWidth();

    // Set all outputs to low values
    outputs.forEach((output) => {
      output.setValue(BitString.low(outputWidth));
    });

    // Calculate the control signal value and set the corresponding output
    const controlSignalVal = controlValue.toUnsigned();
    outputs[controlSignalVal].setValue(inputs[0].getValue());

    return this.getPropagationDelay();
  }
}
