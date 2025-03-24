import { CircuitElement } from "../CircuitElement";
import { CircuitBus } from "../CircuitBus";
import { BitString } from "../BitString";

export class Demultiplexer extends CircuitElement {
  #controlSignal: CircuitBus;

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

    if (!inputValue || !controlValue) {
      return this.getPropagationDelay();
    }

    const outputWidth = inputValue.getWidth();

    outputs.forEach((output) => {
      output.setValue(BitString.low(outputWidth));
    });

    const controlSignalVal = controlValue.toUnsigned();

    outputs[controlSignalVal].setValue(inputs[0].getValue());

    return this.getPropagationDelay();
  }
}
