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

  initialize(value: BitString): void {
    const [q, qInv] = this.getOutputs();

    q.setValue(value);
    qInv.setValue(value.not());
  }
}
