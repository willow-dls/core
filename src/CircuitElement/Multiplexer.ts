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
import { CircuitElement } from "../CircuitElement.js";
import { CircuitBus } from "../CircuitBus.js";
import { Circuit } from "../Circuit.js";

/**
 * A class representing a multiplexer circuit element.
 *
 * The multiplexer selects one of the input buses based on the control signal and sets it to the output bus.
 */
export class Multiplexer extends CircuitElement {
  #controlSignal: CircuitBus;

  /**
   * Creates an instance of a multiplexer.
   *
   * @param inputs An array of input circuit buses for the multiplexer.
   * @param outputs An array of output circuit buses for the multiplexer.
   * @param controlSignal A control signal circuit bus that determines which input to select.
   */
  constructor(
    inputs: CircuitBus[],
    outputs: CircuitBus[],
    controlSignal: CircuitBus,
  ) {
    super("MultiplexerElement", inputs, outputs);

    this.#controlSignal = controlSignal;
  }

  resolve(): number {
    const inputs = this.getInputs();
    const [output] = this.getOutputs();

    const controlValue = this.#controlSignal.getValue();

    if (!controlValue) {
      return this.getPropagationDelay();
    }

    const controlSignalVal = controlValue.toUnsigned();

    if (controlSignalVal >= inputs.length) {
      throw new Error(
        `Multiplexer control signal is set to '${controlSignalVal}', but only has ${inputs.length} inputs.`,
      );
    } else {
      output.setValue(inputs[controlSignalVal].getValue());
    }

    return this.getPropagationDelay();
  }
}
