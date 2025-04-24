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
 * This class implements a JK flip flop. This particular element most closely matches
 * CircuitVerse's implementation, which contains some additional inputs that modify the
 * behavior of the circuit. See the constructor documentation.
 */
export class JKFlipFlop extends SequentialElement {
  /**
   * Constructs a new instance of the JK flip flop.
   *
   * @param clock The clock signal input bus.
   * @param j The J input bus.
   * @param k The K input bus.
   * @param q The Q output bus.
   * @param qInv The inverted Q output bus.
   * @param reset The reset signal input bus. When this value is high, this element simply
   * passes through the `preset` value in real time, bypassing the clock.
   * @param preset The preset signal input bus.
   * @param enable The enable signal input bus.
   */
  constructor(
    clock: CircuitBus,
    j: CircuitBus,
    k: CircuitBus,
    q: CircuitBus,
    qInv: CircuitBus,
    reset: CircuitBus,
    preset: CircuitBus,
    enable: CircuitBus,
  ) {
    super("JKFlipFlopElement", clock, [j, k, reset, preset, enable], [q, qInv]);
  }

  onClockRise(): void {
    const [clock, j, k, reset, preset, enable] = this.getInputs();
    const [q, qInv] = this.getOutputs();

    if (enable.getValue()?.equals(BitString.high())) {
      if (!q.getValue()) {
        q.setValue(BitString.low());
      }

      if (
        j.getValue()?.equals(BitString.high()) &&
        k.getValue()?.equals(BitString.high())
      ) {
        // If both J and K are high, flip-flop
        q.setValue(q.getValue()?.not() ?? null);
      } else if (j.getValue()?.equals(BitString.high())) {
        // J is high, set q high.
        q.setValue(j.getValue());
      } else if (k.getValue()?.equals(BitString.high())) {
        // K is high, set q low.
        q.setValue(k.getValue()?.not() ?? null);
      }
    }
  }

  onResolve(): void {
    const [clock, j, k, reset, preset, enable] = this.getInputs();
    const [q, qInv] = this.getOutputs();

    if (reset.getValue()?.equals(BitString.high())) {
      q.setValue(preset.getValue());
    }

    qInv.setValue(q.getValue()?.not() ?? null);
  }

  onClockFall(): void {}
}
