import { BitString } from "../BitString";
import { CircuitBus } from "../CircuitBus";
import { SequentialElement } from "./SequentialElement";

/**
 * A D Flip-Flop element, which is a sequential logic element.
 * It captures the input value `d` on the rising edge of the clock
 * when the enable signal is high and produces output values `q` and `qInv`.
 */
export class DFlipFlop extends SequentialElement {
  /**
   * Creates an instance of a D Flip-Flop.
   *
   * @param clock The clock signal, used to trigger state updates.
   * @param d The data input signal for the flip-flop.
   * @param q The output signal representing the stored value.
   * @param qInv The inverse output signal representing the inverted stored value.
   * @param reset The reset signal, which sets `q` to the value of `preset` when high.
   * @param preset The preset value to set `q` when reset is high.
   * @param enable The enable signal, which controls whether the flip-flop will capture the input.
   */
  constructor(
    clock: CircuitBus,
    d: CircuitBus,
    q: CircuitBus,
    qInv: CircuitBus,
    reset: CircuitBus,
    preset: CircuitBus,
    enable: CircuitBus,
  ) {
    super("DFlipFlopElement", clock, [d, reset, preset, enable], [q, qInv]);
  }

  onClockRise(): void {
    const [clock, d, reset, preset, enable] = this.getInputs();
    const [q, qInv] = this.getOutputs();

    // Only update the output if the enable signal is high
    if (enable.getValue()?.equals(BitString.high())) {
      // onResolve() will update qInv for us.
      q.setValue(d.getValue());
    }
  }

  onResolve(): void {
    const [clock, d, reset, preset, enable] = this.getInputs();
    const [q, qInv] = this.getOutputs();

    // If reset is high, set q to the preset value
    if (reset.getValue()?.equals(BitString.high())) {
      q.setValue(preset.getValue());
    }

    // Set the inverse output qInv
    qInv.setValue(q.getValue()?.not() ?? null);
  }

  onClockFall(): void {}
}
