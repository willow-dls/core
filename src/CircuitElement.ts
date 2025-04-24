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

import { CircuitBus } from "./CircuitBus";
import { CircuitLoggable } from "./CircuitLogger";

/**
 * A circuit element is a component in a circuit. It represents the fundamental unit of a
 * circuit and is connected via {@link CircuitBus}es. Elements can be logic gates or more
 * complex combinatorial elements. They can even represent sequential elements, though
 * sequential elements are much more complex and require much greater care when implementing.
 *
 * A circuit elements takes its inputs via {@link CircuitBus}es, processes them via the
 * {@link resolve} function, and outputs the results via its output {@link CircuitBus}es.
 * This model seems to work well for most elements, but some bi-directional elements require
 * particularly tricky workarounds, such as {@link Splitter}.
 *
 * The simulation engine keeps track of what values are on the buses, and will take care to
 * evaluate the circuit as few times as possible; if the inputs don't change, then it is
 * assumed that the outputs won't change either and so the circuit element will not be
 * resolved again. The engine will notify an element when its inputs change by calling
 * {@link resolve}, which is responsible for propagating the inputs through the element and
 * to the output buses. When the values on the output buses are changed, the engine will
 * notify all downstream  elements (that is, have inputs connected to
 * these outputs) via their own {@link resolve} function.
 */
export abstract class CircuitElement extends CircuitLoggable {
  #inputs: CircuitBus[];
  #outputs: CircuitBus[];

  #propagationDelay: number;
  #label: string | null;

  /**
   * Construct a new circuit element.
   * @param subsystem Since {@link CircuitElement} is {@link CircuitLoggable},
   * it accepts a subsystem label. Subclasses should provide a descriptive subsystem
   * label which ends in "Element" to allow convenient regex matching. In fact, this
   * convention is enforced; if an element's subsystem doesn't end in "Element", the
   * word is appended directly to the subsystem label before being passed to the
   * {@link CircuitLoggable} constructor. For example, if you provide "AndGate", the
   * actual subsystem label will be "AndGateElement". But if you directly provide
   * "AndGateElemement", that will be passed through unchanged.
   * @param inputs An array of input {@link CircuitBus}es. Whenever the values on these
   * buses change, the circuit element will be notified via the {@link resolve} function.
   * @param outputs An array of output {@link CircuitBus}es.
   */
  constructor(subsystem: string, inputs: CircuitBus[], outputs: CircuitBus[]) {
    super(subsystem.endsWith("Element") ? subsystem : subsystem + "Element");
    this.#inputs = inputs;
    this.#outputs = outputs;

    // Connections may be undefined; it is possible to save elements that aren't
    // actually connected to anything.
    this.#inputs.forEach((i) => i?.connectElement(this));
    this.#outputs.forEach((i) => i?.connectElement(this));

    this.#propagationDelay = 0;
    this.#label = null;
  }

  /**
   * Compute this element's output values after the input values have changed.
   * This function can use {@link getInputs} to get the inputs in the same order
   * they were passed to the constructor. It is helpful to destructure the array
   * using the same names as were provided to the constructor. Likewise, this
   * function can use {@link getOutputs} to get the output buses in the same order
   * they were passed to the constructor.
   *
   * The goal of this function is to actually do the logic of the element, translating
   * the values on the input buses to values on the output buses.
   *
   * @returns The actual propagation delay of this element. Even though this class
   * provides {@link getPropagationDelay} and {@link setPropagationDelay}, a
   * circuit element may actually take more or less time to evaluate itself,
   * and in some cases, a fixed call to {@link setPropagationDelay} with a static
   * number isn't appropriate at all (e.g. in the case of {@link SubCircuit}, which
   * inherits the propagation delay from the actual subcircuit.)
   */
  abstract resolve(): number;

  /**
   * Retrieve the input buses going in to this circuit element, in the order that
   * they were passed to the {@link CircuitElement} constructor.
   * @returns An array of {@link CircuitBus} objects.
   */
  getInputs(): CircuitBus[] {
    return this.#inputs;
  }

  /**
   * Retrieve the output buses going out from this circuit element, in the order that
   * they were passed to the {@link CircuitElement} constructor.
   * @returns An array of {@link CircuitBus} objects.
   */
  getOutputs(): CircuitBus[] {
    return this.#outputs;
  }

  /**
   * This method resets the circuit element to a known state, and is called at the
   * beginning of each simulation run, but not between clock cycles. It is expected
   * to be overridden only by child elements who have internal state which they may
   * need to reset when the circuit is re-run with new inputs.
   *
   * For example, see the {@link Splitter} element or any of the flip-flops, which are
   * sequential elements and thus must retain a history of inputs and outputs to know
   * how to propagate new outputs.
   *
   * If you are going to override this method, be sure to still call the superclass
   * method first: `super.reset()`.
   */
  reset(): void {
    this.getInputs().forEach((i) => i.setValue(null, -1));
    this.getOutputs().forEach((o) => o.setValue(null, -1));
  }

  /**
   * Store a propagation delay number. This function is useful when loading in circuit
   * elements which support custom propagation delays, so that {@link resolve} can
   * return the result of {@link getPropagationDelay} if it is constant and doesn't change
   * with each resolution.
   * @param delay The propagation delay to store.
   * @returns An instance of this element for method chaining.
   */
  setPropagationDelay(delay: number): CircuitElement {
    this.#propagationDelay = delay;
    return this;
  }

  /**
   * Set the label on this element. Some circuit simulators allow arbitrary labels
   * on all elements, which is useful for debugging purposes. If a label is provided,
   * it will be printed in the logs to more easily identify circuit elements.
   * @param label The label of this circuit element.
   * @returns An instance of this element for method chaining.
   */
  setLabel(label: string): CircuitElement {
    this.#label = label;
    return this;
  }

  /**
   * Get the stored propagation delay. See comments for {@link setPropagationDelay}.
   * @returns The stored propagation delay. If no delay was ever set with
   * {@link setPropagationDelay}, then `0` is returned.
   */
  protected getPropagationDelay(): number {
    return this.#propagationDelay;
  }

  /**
   * Get the stored label of this element. See comments for {@link setLabel}.
   * @returns The stored label, or `null` if the label was never set.
   */
  getLabel(): string | null {
    return this.#label;
  }

  /**
   * Convert this element to a string for representation in log output.
   * @returns A string in the format of `ClassName[id=XXX]('YYY')` where `ClassName`
   * is the name of the class, `XXX` is the unique loggable ID of the specific
   * class instance, and `YYY` is the user-provided label set by {@link setLabel},
   * if any.
   */
  toString() {
    return `${this.constructor.name}[id=${this.getId()}]${this.#label ? `('${this.#label}')` : ""}`;
  }
}
