import { BitString } from "../BitString";
import { CircuitElement } from "../CircuitElement";
import { CircuitBus } from "../CircuitBus";

export class Multiplexer extends CircuitElement {
  #controlSignal;

  constructor(inputs: CircuitBus[], outputs: CircuitBus[], controlSignal: CircuitBus) {
    super("Multiplexer", inputs, outputs);

    this.#controlSignal = controlSignal;
  }

  resolve(): number {
    const inputs = this.getInputs();
    const [output] = this.getOutputs();

    const controlSignalVal = Number(this.#controlSignal.getValue()) 

    if (controlSignalVal < 0 || controlSignalVal >= inputs.length) {
      output.setValue(BitString.low());
    } else {
      output.setValue(inputs[controlSignalVal].getValue());
    }

    return 10;
  }
}
