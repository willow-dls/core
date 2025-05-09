/*
 * Copyright (c) 2025 Jordan Bancino <jordan@bancino.net>
 * Copyright (c) 2025 Austin Hargis <hargisa@mail.gvsu.edu>
 * Copyright (c) 2025 Aaron MacDougall <macdouaa@mail.gvsu.edu>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

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

  initialize(value: BitString): void {
    const [q, qInv] = this.getOutputs();

    q.setValue(value);
    qInv.setValue(value.not());
  }
}
