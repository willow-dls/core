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
import { LogLevel } from "../CircuitLogger";

/**
 * A simple tri state element, which passes through its input to the output
 * when the control line is high, and impedes the input, preventing it from
 * going to the output when the control line is low.
 */
export class TriState extends CircuitElement {
  /**
   * Constructs a new instance of the TriStateElement.
   *
   * @param input The input bus for the tri-state element.
   * @param state The state bus that controls the tri-state behavior.
   * @param output The output bus for the tri-state element.
   */
  constructor(input: CircuitBus, state: CircuitBus, output: CircuitBus) {
    super("TriStateElement", [input, state], [output]);
  }

  resolve(): number {
    const state = this.getInputs()[1];
    const output = this.getOutputs()[0];

    if (state.getValue()?.equals("1")) {
      const input = this.getInputs()[0];

      this.log(
        LogLevel.TRACE,
        `State is high, passing through input: ${input.getValue()}`,
      );

      output.setValue(input.getValue());
    } else {
      this.log(LogLevel.TRACE, `State is low, impeding output.`);
      output.setValue(null);
    }

    return this.getPropagationDelay();
  }
}
