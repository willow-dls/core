import { BitString } from "../BitString";
import { CircuitElement } from "../CircuitElement";
import { CircuitBus } from "../CircuitBus";
import { Circuit } from "../Circuit";

export class Multiplexer extends CircuitElement {
  #controlSignal: CircuitBus;

  constructor(inputs: CircuitBus[], outputs: CircuitBus[], controlSignal: CircuitBus) {
    super("MultiplexerElement", inputs, outputs);

    this.#controlSignal = controlSignal;
  }

  resolve(): number {
    const inputs = this.getInputs();
    const [output] = this.getOutputs();

    const controlSignalVal = Number(this.#controlSignal.getValue());

    if (controlSignalVal < 0 || controlSignalVal >= inputs.length) {
      output.setValue(BitString.low());
    } else {
      output.setValue(inputs[controlSignalVal].getValue());
    }

    return 10;
  }
}
