import { CircuitBus } from "../CircuitBus";
import { CircuitElement } from "../CircuitElement";

export class TwosCompliment extends CircuitElement {
  constructor(input: CircuitBus, output: CircuitBus) {
    super("TwosComplimentElement", [input], [output]);
  }

  resolve(): number {
    const [input] = this.getInputs();
    const [output] = this.getOutputs();

    output.setValue(input.getValue()?.twosCompliment() ?? null);

    return this.getPropagationDelay();
  }
}
