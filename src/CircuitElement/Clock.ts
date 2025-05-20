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
import { CircuitElement } from "../CircuitElement.js";

/**
 * The clock element allows the simulation engine to iteratively run the
 * simulation and provide a clock signal in the process. The clock element
 * is somewhat unique in that it is heavily integrated with the circuit
 * engine because the engine needs to invoke methods like {@link tick}
 * in a loop and then propagate the clock signal to the circuit being
 * run.
 *
 * The clock should generally not be modified directly by end users; rather
 * the simulation event loop will automatically tick the clock as appropriate.
 */
export class Clock extends CircuitElement {
  #value: BitString;

  /**
   * Create a new clock.
   * @param output The clock signal will be output on this bus.
   */
  constructor(output: CircuitBus) {
    super("ClockElement", [], [output]);

    this.#value = BitString.low();
  }

  resolve(): number {
    const [output] = this.getOutputs();
    output.setValue(this.#value);

    return this.getPropagationDelay();
  }

  /**
   * Set the clock signal high for the next call of {@link resolve}.
   */
  setHigh(): void {
    this.#value = BitString.high();
  }

  /**
   * Set the clock signal low for the next call of {@link resolve}.
   */
  setLow(): void {
    this.#value = BitString.low();
  }

  /**
   * Invert the clock signal for the next call of {@link resolve}. That is,
   * if it was high, set it low, and if it was low, set it high. This method
   * internally uses {@link setHigh} and {@link setLow} and is the only method
   * used by the simulation engine.
   *
   * The other are made public for future use, but aren't used at this time.
   */
  tick(): void {
    if (this.#value.equals(BitString.low())) {
      this.setHigh();
    } else {
      this.setLow();
    }
  }
}
