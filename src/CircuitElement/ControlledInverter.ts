import { BitString } from "../BitString";
import { CircuitBus } from "../CircuitBus";
import { CircuitElement } from "../CircuitElement";

/**
 * The controlled inverter element is just an inverted {@link TriState}.
 * It behaves just like a {@link TriState}, except when it outputs, it
 * outputs the negation of the input value.
 */
export class ControlledInverter extends CircuitElement {
  /**
   *
   * @param input The input bus.
   * @param state The toggle bus. When high, the input value is negated and passed
   * through the inverter. When it is low, output is impeded entirely.
   * @param output The output bus.
   */
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
