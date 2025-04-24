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
 * The controlled inverter element is just an inverted {@link TriState}.
 * It behaves just like a {@link TriState}, except when it outputs, it
 * outputs the negation of the input value.
 */
export class ControlledInverter extends CircuitElement {
  /**
   *
   * @param input The input bus.
   * @param state The toggle bus. When high, the input value is negated and passed
   * through the inverter. When it is low, output is impeded entirely.
   * @param output The output bus.
   */
  constructor(input: CircuitBus, state: CircuitBus, output: CircuitBus) {
    super("ControlledInverterElement", [input, state], [output]);
  }
  resolve(): number {
    const [input, state] = this.getInputs();
    const [output] = this.getOutputs();

    if (state.getValue()?.equals(BitString.high())) {
      output.setValue(input.getValue()?.not() ?? null);
    } else {
      output.setValue(null);
    }

    return this.getPropagationDelay();
  }
}
