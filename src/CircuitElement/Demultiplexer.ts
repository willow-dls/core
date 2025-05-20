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

import { CircuitElement } from "../CircuitElement.js";
import { CircuitBus } from "../CircuitBus.js";
import { BitString } from "../BitString.js";

/**
 * A Demultiplexer element for routing a signal to one of many outputs based on a control signal.
 * This class extends from the `CircuitElement` and processes input and output values based on a control signal.
 *
 * @extends CircuitElement
 */
export class Demultiplexer extends CircuitElement {
  #controlSignal: CircuitBus;

  /**
   * Creates an instance of a Demultiplexer element.
   *
   * @param inputs The input buses.
   * @param outputs The output buses.
   * @param controlSignal The control signal bus used to determine which output will receive the input value.
   */
  constructor(
    inputs: CircuitBus[],
    outputs: CircuitBus[],
    controlSignal: CircuitBus,
  ) {
    super("DemultiplexerElement", inputs, outputs);

    this.#controlSignal = controlSignal;
  }

  resolve(): number {
    const inputs = this.getInputs();
    const outputs = this.getOutputs();

    const inputValue = inputs[0].getValue();
    const controlValue = this.#controlSignal.getValue();

    // If input or control signal is not active, don't do anything
    if (!inputValue || !controlValue) {
      return this.getPropagationDelay();
    }

    const outputWidth = inputValue.getWidth();

    // Set all outputs to low values
    outputs.forEach((output) => {
      output.setValue(BitString.low(outputWidth));
    });

    // Calculate the control signal value and set the corresponding output
    const controlSignalVal = controlValue.toUnsigned();
    outputs[controlSignalVal].setValue(inputs[0].getValue());

    return this.getPropagationDelay();
  }
}
