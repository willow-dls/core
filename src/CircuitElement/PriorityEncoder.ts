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
 * Class representing a priority encoder element in a circuit.
 * In a priority encoder, the output is determined by the highest-priority active input signal.
 * The element outputs a binary code corresponding to the highest active input.
 */
export class PriorityEncoder extends CircuitElement {
  #enableSignal: CircuitBus;

  /**
   * Creates an instance of the PriorityEncoder.
   *
   * @param input The input signals to the encoder.
   * @param output The output signals from the encoder.
   * @param enable The enable signal that activates or deactivates the encoder.
   */
  constructor(input: CircuitBus[], output: CircuitBus[], enable: CircuitBus) {
    super("PriorityEncoderElement", input, output);
    this.#enableSignal = enable;
  }

  resolve(): number {
    const input = this.getInputs();
    const output = this.getOutputs();

    let inputValues = [];
    let inputString = [];
    let validInputs = true;

    // Iterate through inputs to check their values
    for (let i = 0; i < input.length; i++) {
      inputValues[i] = input[i].getValue();
      inputString[i] = inputValues[i]?.toString();
      if (!inputValues[i]) {
        validInputs = false;
      }
    }

    // Get the value of the enable signal
    const enableValue = this.#enableSignal.getValue();

    // If inputs are invalid or the enable signal is low, set outputs to low and return propagation delay
    if (!validInputs || enableValue == BitString.low()) {
      for (let i = 0; i < output.length; i++) {
        output[i].setValue(BitString.low());
      }

      return this.getPropagationDelay();
    }

    const inputWidth = input.length;

    // Log the input values for debugging purposes
    this.log(LogLevel.TRACE, `Input: [width=${inputWidth}] '${inputString}'`);

    // Process inputs starting from the highest index (priority encoder logic)
    for (let i = inputWidth - 1; i >= 0; i--) {
      if (inputString[i] == "1") {
        let num = i;
        // Set the binary output corresponding to the active input signal
        for (let j = 0; j < output.length; j++) {
          let r = num % 2;
          num = Math.floor(num / 2);
          output[j].setValue(new BitString(r.toString()));
        }

        return this.getPropagationDelay();
      }
    }

    // If no active input is found, log and set output to low
    this.log(LogLevel.TRACE, `No Priority Encoder found.`);
    for (let i = 0; i < output.length; i++) {
      output[i].setValue(BitString.low());
    }

    return this.getPropagationDelay();
  }
}
