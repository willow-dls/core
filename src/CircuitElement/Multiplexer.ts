import { BitString } from "../BitString";
import { CircuitElement } from "../CircuitElement";
import { CircuitBus } from "../CircuitBus";

export class Multiplexer extends CircuitElement {
  #numInputs: number;

  constructor(inputs: CircuitBus[], outputs: CircuitBus[]) {
    super("Multiplexer", inputs, outputs);

    this.#numInputs = this.getInputs().length;
  }

  resolve(): number {
    const inputs = this.getInputs();
    const [output] = this.getOutputs();

    const controlSignal = Number(inputs[this.#numInputs].getValue());

    if (controlSignal < 0 || controlSignal >= this.#numInputs) {
      output.setValue(BitString.low());
    } else {
      output.setValue(inputs[controlSignal].getValue());
    }

    return 10;
  }
}
