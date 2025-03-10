import { CircuitElement } from "../CircuitElement";
import { CircuitBus } from "../CircuitBus";
import { BitString } from "../BitString";

export class LSB extends CircuitElement {
  #bitstring: BitString;

  constructor(inputs: CircuitBus[], outputs: CircuitBus[]) {
    super("LSB", inputs, outputs);
    this.#bitstring = this.getInputs()[0].getValue();
  }

  resolve(): number {
    const inputs = this.getInputs();
    const outputs = this.getOutputs();

    this.#bitstring = inputs[0].getValue();

    // Perform bitwise AND to find LSB
    const lsb = Number(this.#bitstring) & 1;

    outputs[0].setValue(new BitString(String(lsb)));

    // Set the ENABLE output if it exists
    if (outputs.length > 1) {
      outputs[1].setValue(new BitString(String(1)));
    }

    return 10;
  }
}
