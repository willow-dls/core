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

import { CircuitBus } from "../CircuitBus";
import { CircuitElement } from "../CircuitElement";

/**
 * A simple adder which supports operands of any width.
 */
export class Adder extends CircuitElement {
  /**
   * Construct a new adder.
   * @param a The first operand bus.
   * @param b The second operand bus.
   * @param carryIn The carry in bus.
   * @param sum The output bus.
   * @param carryOut The carry out bus.
   */
  constructor(
    a: CircuitBus,
    b: CircuitBus,
    carryIn: CircuitBus,
    sum: CircuitBus,
    carryOut: CircuitBus,
  ) {
    super("AdderElement", [a, b, carryIn], [sum, carryOut]);
  }

  resolve(): number {
    const [a, b, carryIn] = this.getInputs();
    const [sum, carryOut] = this.getOutputs();

    const valA = a.getValue();
    const valB = b.getValue();
    const valC = carryIn.getValue();

    if (!valA || !valB || !valC) {
      // Values aren't on the line, can't reasonably do any computation.
      return this.getPropagationDelay();
    }

    // Pad with an extra bit to detect carry out.
    const addition = valA
      .pad(valA.getWidth() + 1)
      .add(valB.pad(valB.getWidth() + 1))
      .add(valC.pad(valA.getWidth() + 1)); // Pad carry in to width of other operands.

    // Strip off carry out bit before setting sum.
    sum.setValue(addition.substring(1));
    carryOut.setValue(addition.msb(1)); // Grab carry out bit only.

    return this.getPropagationDelay();
  }
}
