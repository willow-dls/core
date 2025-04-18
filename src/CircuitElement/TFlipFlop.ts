import { BitString } from "../BitString";
import { CircuitBus } from "../CircuitBus";
import { SequentialElement } from "./SequentialElement";

/**
 * A T-Flip-Flop, which is a type of sequential circuit element.
 */
export class TFlipFlop extends SequentialElement {
  /**
   * Creates an instance of the T-FlipFlop.
   *
   * @param clock The clock input signal.
   * @param d The data input signal.
   * @param q The Q output signal.
   * @param qInv The inverted Q output signal (Q').
   * @param reset The reset input signal.
   * @param preset The preset input signal.
   * @param enable The enable input signal.
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
    super("TFlipFlopElement", clock, [d, reset, preset, enable], [q, qInv]);
  }

  onClockRise(): void {
    const [clock, d, reset, preset, enable] = this.getInputs();
    const [q, qInv] = this.getOutputs();

    if (enable.getValue()?.equals(BitString.high())) {
      if (!d.getValue()) {
        d.setValue(BitString.low());
      }

      // onResolve() will update qInv for us.
      q.setValue(d.getValue()?.not() ?? null);
    }
  }

  onResolve(): void {
    const [clock, d, reset, preset, enable] = this.getInputs();
    const [q, qInv] = this.getOutputs();

    if (reset.getValue()?.equals(BitString.high())) {
      q.setValue(preset.getValue());
    }

    qInv.setValue(q.getValue()?.not() ?? null);
  }

  onClockFall(): void {}
}
