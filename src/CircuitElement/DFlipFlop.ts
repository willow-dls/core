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

  initialize(value: BitString): void {
    const [q, qInv] = this.getOutputs();

    q.setValue(value);
    qInv.setValue(value.not());
  }
}
