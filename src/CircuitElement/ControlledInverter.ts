import { BitString } from "../BitString";
import { CircuitBus } from "../CircuitBus";
import { CircuitElement } from "../CircuitElement";

// Basically just an inverted TriState.
export class ControlledInverter extends CircuitElement {
  constructor(input: CircuitBus, state: CircuitBus, output: CircuitBus) {
    super("ControlledInverterElement", [input, state], [output]);
  }
  resolve(): number {
    const [input, state] = this.getInputs();
    const [output] = this.getOutputs();

    if (state.getValue()?.equals(BitString.high())) {
      output.setValue(input.getValue()?.not() ?? null);
    } else {
      output.setValue(null);
    }

    return this.getPropagationDelay();
  }
}
