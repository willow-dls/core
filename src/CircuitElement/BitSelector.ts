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

import { CircuitElement } from "../CircuitElement";
import { CircuitBus } from "../CircuitBus";
import { BitString } from "../BitString";
import { LogLevel } from "../CircuitLogger";

/**
 * A bit selector element which takes a single or multi-bit input and outputs
 * the bit that must be isolated using a single or multi-bit select line.
 * The select line value indicates the specific bit that must be isolated within
 * its body in decimal form.
 */
export class BitSelector extends CircuitElement {
  /**
   * Create a new bit selector element.
   * @param input The input bus.
   * @param output The output bus.
   * @param bitSelector The selector bus, which holds the index of the bit from the
   * input to pass to the output.
   */
  constructor(input: CircuitBus, output: CircuitBus, bitSelector: CircuitBus) {
    super("BitSelectorElement", [input, bitSelector], [output]);
  }

  resolve(): number {
    const [input, bitSelector] = this.getInputs();
    const [output] = this.getOutputs();

    const inputValue = input.getValue();
    const bitSelectorValue = bitSelector.getValue();

    if (!bitSelectorValue || !inputValue) {
      return this.getPropagationDelay();
    }

    const bitSelectorIndx = bitSelectorValue.toUnsigned();
    const inputWidth = inputValue.getWidth();

    output.setValue(
      new BitString(
        inputValue.toString()[Math.abs(bitSelectorIndx - inputWidth + 1)],
      ),
    );

    this.log(
      LogLevel.TRACE,
      `Input: [width=${inputWidth}] '${inputValue.toString()}'`,
    );

    return this.getPropagationDelay();
  }
}
