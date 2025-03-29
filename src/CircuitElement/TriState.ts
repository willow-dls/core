import { CircuitBus } from "../CircuitBus";
import { CircuitElement } from "../CircuitElement";
import { LogLevel } from "../CircuitLogger";

/**
 * A simple tri state element, which passes through its input to the output
 * when the control line is high, and impedes the input, preventing it from
 * going to the output when the control line is low.
 */
export class TriState extends CircuitElement {
  /**
   * Constructs a new instance of the TriStateElement.
   *
   * @param input The input bus for the tri-state element.
   * @param state The state bus that controls the tri-state behavior.
   * @param output The output bus for the tri-state element.
   */
  constructor(input: CircuitBus, state: CircuitBus, output: CircuitBus) {
    super("TriStateElement", [input, state], [output]);
  }

  resolve(): number {
    const state = this.getInputs()[1];
    const output = this.getOutputs()[0];

    if (state.getValue()?.equals("1")) {
      const input = this.getInputs()[0];

      this.log(
        LogLevel.TRACE,
        `State is high, passing through input: ${input.getValue()}`,
      );

      output.setValue(input.getValue());
    } else {
      this.log(LogLevel.TRACE, `State is low, impeding output.`);
      output.setValue(null);
    }

    return this.getPropagationDelay();
  }
}
