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

import { BitString } from "../BitString.js";
import { CircuitBus } from "../CircuitBus.js";
import { SequentialElement } from "./SequentialElement.js";

/**
 * Represents a D-Latch circuit element, a type of sequential logic circuit.
 * The D-Latch captures the value of the data input (`d`) on the rising edge of the clock signal
 * and outputs it to `q` and its complement to `qInv`.
 */
export class DLatch extends SequentialElement {
  /**
   * Constructs a new DLatch instance.
   *
   * @param clock The clock signal input bus.
   * @param d The data input bus.
   * @param q The output bus for the stored value.
   * @param qInv The output bus for the complement of the stored value.
   */
  constructor(
    clock: CircuitBus,
    d: CircuitBus,
    q: CircuitBus,
    qInv: CircuitBus,
  ) {
    super("DLatchElement", clock, [d], [q, qInv]);
  }

  onClockRise(): void {
    const [clock, d] = this.getInputs();
    const [q, qInv] = this.getOutputs();

    q.setValue(d.getValue()?.not() ?? null);
    qInv.setValue(d.getValue()?.not() ?? null);
  }

  onResolve(): void {}

  onClockFall(): void {}

  initialize(value: BitString): void {
    const [q, qInv] = this.getOutputs();

    q.setValue(value);
    qInv.setValue(value.not());
  }
}
