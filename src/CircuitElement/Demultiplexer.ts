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
    super("Demultiplexer", inputs, outputs);

    this.#controlSignal = controlSignal;
  }

  resolve(): number {
    const inputs = this.getInputs();
    const outputs = this.getOutputs();

    outputs.forEach((output) => {
      output.setValue(new BitString("0"));
    });

    const controlSignalVal = Number(this.#controlSignal.getValue());

    outputs[controlSignalVal].setValue(inputs[0].getValue());

    return 10;
  }
}
