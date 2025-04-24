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

/**
 * The input element is the primary means of interfacing with a circuit.
 * It allows you to feed data into the circuit to be evaluated, and makes
 * provisions for setting bus values directly in code. Well-crafted circuits
 * will contain ample inputs wich can be populated with values by label via
 * {@link Circuit.run}. See the documentation for that method for the normal
 * way of providing values to circuit inputs.
 */
export class Input extends CircuitElement {
  #index: number;
  #label: string;
  #value: BitString;

  /**
   * Construct a new input element.
   * @param index Some circuit simulators refer to inputs by an index in an array
   * when executing subcircuits. Assign an index to this input to ensure that it
   * gets set in the exact same order every time. Since this engine doesn't primarily
   * interface with inputs this way, we need to know the original index to properly
   * set input values.
   * @param label Most circuit simulators allow referring to inputs by a human-readable
   * label. This is the recommended way to set inputs, and a good label should be provided
   * for use with {@link Circuit.run}.
   * @param outputs The output buses onto which the input value will be written.
   * @param initialValue An initial value that the input will start with.
   */
  constructor(
    index: number,
    label: string,
    outputs: CircuitBus[],
    initialValue: BitString = BitString.low(),
  ) {
    super("InputElement", [], outputs);
    this.#index = index;
    this.#value = initialValue;
    this.#label = label;
  }

  /**
   * Get the index of this input.
   * @returns The index number that was passed into the constructor.
   */
  getIndex(): number {
    return this.#index;
  }

  /**
   * Set the index of this input. This function is used to ensure the proper
   * functionality of subcircuits.
   *
   * > [!WARNING]
   * > This is intended to be used by {@link CircuitLoader}s only.
   * > You should never call this function from code outside of a loader
   * > implementation.
   *
   * @param index The new index.
   * @returns This input for method chaining.
   */
  setIndex(index: number): Input {
    this.#index = index;
    return this;
  }

  /**
   * Get the label of this input.
   * @returns The label string that was passed into the constructor.
   */
  getLabel(): string {
    return this.#label;
  }

  /**
   * Set a new value for this input, which will be propagated to the
   * circuit.
   * @param value The value to send to the output buses.
   */
  setValue(value: BitString) {
    this.#value = value;
  }

  resolve(): number {
    const outputs = this.getOutputs();
    outputs.forEach((o) => o.setValue(this.#value));
    return this.getPropagationDelay();
  }
}
