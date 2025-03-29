import { BitString } from "../BitString";
import { CircuitBus } from "../CircuitBus";
import { CircuitElement } from "../CircuitElement";

/**
 * SR Flip-Flop Circuit Element.
 *
 * This class represents an SR flip-flop (Set-Reset flip-flop) circuit element. It includes inputs for
 * Set (S), Reset (R), preset, reset, and enable, and provides outputs for Q and Q inverse (Q').
 *
 * The flip-flop operates based on the state of the inputs and the enable signal. When enable is high,
 * the S and R inputs determine the state of the output Q. If reset is high, the preset value is passed
 * to Q regardless of other inputs.
 *
 * @extends {CircuitElement}
 */
export class SRFlipFlop extends CircuitElement {
  /**
   * Creates an instance of the SR flip flop element.
   *
   * @param s The Set input (S).
   * @param r The Reset input (R).
   * @param q The output (Q).
   * @param qInv The inverted output (Q').
   * @param reset The reset input.
   * @param preset The preset value input.
   * @param enable The enable input.
   */
  constructor(
    s: CircuitBus,
    r: CircuitBus,
    q: CircuitBus,
    qInv: CircuitBus,
    reset: CircuitBus,
    preset: CircuitBus,
    enable: CircuitBus,
  ) {
    super("SRFlipFlopElement", [s, r, reset, preset, enable], [q, qInv]);
  }

  resolve(): number {
    const [s, r, reset, preset, enable] = this.getInputs();
    const [q, qInv] = this.getOutputs();

    // Only use S and R if Enable is high.
    if (enable.getValue()?.equals(BitString.high())) {
      const sHigh = s.getValue()?.equals(BitString.high());
      const rHigh = r.getValue()?.equals(BitString.high());

      // If S or R is high (but not both), then set Q to the value of
      // S (either high or low.) Otherwise, do nothing.
      if ((sHigh && !rHigh) || (!sHigh && rHigh)) {
        q.setValue(s.getValue());
      }
    }

    // Regardless of whatever else happened above, if reset is high, pass
    // the preset value through.
    if (reset.getValue()?.equals(BitString.high())) {
      q.setValue(preset.getValue());
    }

    qInv.setValue(q.getValue()?.not() ?? null);
    return this.getPropagationDelay();
  }
}
