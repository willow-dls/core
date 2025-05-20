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
 * The Gate class is an abstract class which provides common functionality
 * for simple logic gates, such as the common AND, OR, NOT, etc. This class
 * implements {@link CircuitElement}'s `resolve()` method and provides a new
 * abstract method {@link evaluate} which is intended to perform a single
 * arithmetic operation using the previous value and the current value.
 * It is essentially an interface for `reduce()` that collects all of a circuit's
 * inputs and reduces them to a single output, taking care of all the boilerplate
 * behavior to make it possible for actual gate implementations to only have
 * to implement the actual arithmetic or logical operations.
 */
export abstract class Gate extends CircuitElement {
  /**
   * Constructs a new Gate.
   *
   * @param inputs An array of buses representing the input buses for the gate.
   * @param outputs An array of buses representing the output buses for the gate.
   */
  constructor(inputs: CircuitBus[], outputs: CircuitBus[]) {
    super("GateElement", inputs, outputs);
  }

  resolve(): number {
    const inputs = this.getInputs();
    const outputs = this.getOutputs();

    const inputValues = inputs.map((i) => i.getValue());
    const result: BitString | null =
      inputValues.length == 1 && inputValues[0] != null
        ? this.evaluate(BitString.low(), inputValues[0] as BitString)
        : inputValues.slice(1).reduce((prev, cur) => {
            return this.evaluate(
              prev ?? BitString.low(),
              cur ?? BitString.low(),
            );
          }, inputValues[0]);

    outputs.forEach((o) => o.setValue(result));

    return this.getPropagationDelay();
  }

  /**
   * Evaluate a gate output based on two input operands. These are called the "previous"
   * and "next" values because this function is called iteratively in a `reduce()`-like
   * manner to evaluate all of the circuit outputs.
   * @param previousValue The last value that was evaluated, or the first raw input value.
   * @param currentValue The current raw input value to be factored in to the circuit
   * evaluation.
   * @returns The result of performing a logical operation on the two input operands.
   */
  abstract evaluate(
    previousValue: BitString,
    currentValue: BitString,
  ): BitString;
}
