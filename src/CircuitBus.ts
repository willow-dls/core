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

import { BitString } from "./BitString";
import { CircuitElement } from "./CircuitElement";

/**
 * A circuit bus is simply a wire or collection of wires. A bus is commonly
 * called a "wire" or a "node" in other simulators, but the concept is
 * identical. A bus carries one or more bits between {@link CircuitElement}s.
 * Buses have a width, which is the number of physical wires bundled within
 * the bus, so they can transport bit values of any size.
 *
 * Circuit buses exist exclusively to connect {@link CircuitElement}s together
 * and communicate {@link BitString}s between them. One element will set a
 * {@link BitString} value on its output bus, and another which is connected to
 * that same bus as an input will read that {@link BitString} value as its input.
 *
 * > [!NOTE] Circuit buses are not required to have a value on them. It is very
 * > possible for the bus to be in a "floating" state where the value will be
 * > returned as `null` because it is indeterminate. Take caution in all circuit
 * > element implementations to ensure that indeterminate bus values are handled
 * > properly.
 */
export class CircuitBus {
  #connections: CircuitBus[];
  #elements: CircuitElement[];
  #value: BitString | null;
  #width: number;
  #lastUpdate: number;

  /**
   * Construct a new circuit bus.
   * @param bitWidth The fixed width of the bus. All values set with {@link setValue}
   * must be of exactly this width, unless no value is set.
   * @param connections An array of other buses which are directly connected to this
   * bus. When the value changes on this bus, it will be propagated to all of these
   * other buses as well.
   */
  constructor(bitWidth: number, ...connections: CircuitBus[]) {
    this.#connections = connections;
    this.#width = bitWidth;
    this.#elements = [];
    this.#value = null;
    this.#lastUpdate = -1;
  }

  /**
   * Connect another bus to this one, so that when the value changes on this bus, it
   * will be propagated to this one as well.
   * @param bus The bus to connect to this one.
   * @returns The instance of the bus this method was called on, for method chaining.
   */
  connect(bus: CircuitBus): CircuitBus {
    if (this.#elements.length > 0) {
      throw new Error(
        "Cannot connect a circuit bus after elements have been added.",
      );
    }
    this.#connections.push(bus);
    return this;
  }

  /**
   * Retrieve all buses which are connected to this one. Buses are connected either
   * in the constructor or with the {@link connect} method.
   * @returns An array of {@link CircuitBus}es.
   */
  getConnections(): CircuitBus[] {
    return this.#connections;
  }

  /**
   * Connect an element to this bus. Whenever the value on this bus changes, it will
   * be propagated to this element. This method primarily exists so that the simulation
   * engine can collect a list of all elements which might be affected by a bus change,
   * but it will do further filtering to determine if the elements actually are
   * affected. See {@link getElements}, the method called internally by the simulator.
   * @param element The element that is supposed to be connected to this bus.
   * @returns The instance of the bus this method was called on, for method chaining.
   */
  connectElement(element: CircuitElement): CircuitBus {
    if (!this.#elements.includes(element)) {
      this.#elements.push(element);
      this.#connections.forEach((n) => n.connectElement(element));
    }

    return this;
  }

  /**
   * Retrieve all of the elements that are connected to this bus in some capacity,
   * either as an input or an output, it doesn't matter at this point.
   * @returns An array of all the elements connected to this bus in some capacity.
   */
  getElements(): CircuitElement[] {
    return this.#elements;
  }

  /**
   * Set a {@link BitString} value on this bus, propagating it to all other buses
   * connected to this one.
   * @param value The bit string value to set on this bus. The width of this value must
   * be less than or equal to the width of the bus. If the value is too wide, the bus will
   * throw an exception. If it is too low, the value will be automatically zero-padded to
   * ensure that the width matches what connected elements are expecting.
   * @param lastUpdate An optional last update timestamp. See {@link setLastUpdate}
   * for details.
   */
  setValue(value: BitString | null, lastUpdate?: number): void {
    if (value == this.#value) {
      return;
    }

    if (value) {
      if (value.equals(this.#value)) {
        return;
      }

      if (value.getWidth() > this.#width) {
        throw new Error(
          `Bus error: Attempting to set ${value.getWidth()}-bit value '${value}' on ${this.#width}-bit bus, currently holding '${this.#value}'.`,
        );
      }

      if (value.getWidth() < this.#width) {
        value = value.pad(this.#width);
      }
    }

    this.#value = value;
    // Propagate value to connected nodes.
    this.#connections.forEach((c) => c.setValue(value, lastUpdate));

    if (lastUpdate !== undefined) {
      this.setLastUpdate(lastUpdate);
    }
  }

  /**
   * The simulation engine requires information about when buses were last updated for
   * efficiently evaluating circuits. It uses this information particularly for tricky
   * elements which may be bi-directional, and it allows elements to query when a bus
   * was last updated to determine which direction to propagate.
   * @param t The timestamp, which should be greater than or equal to the last timestamp,
   * unless the simulation is being reset; then it should be set to -1.
   */
  setLastUpdate(t: number): void {
    if (this.#lastUpdate == t) {
      return;
    }

    this.#lastUpdate = t;
    // Propagate value to connected nodes.
    this.#connections.forEach((c) => c.setLastUpdate(t));
  }

  /**
   * Get the simulation timestamp that this bus was last updated. It is intended to be
   * used in comparisons with other timestamps only; it is unlikely that the value by itself
   * will be meaningful in any way outside the simulation.
   * @returns The last update timestamp. See {@link setLastUpdate}
   */
  getLastUpdate(): number {
    return this.#lastUpdate;
  }

  /**
   * Get the value currently on this bus.
   *
   * @returns The value on this bus, represented as a {@link BitString}, or `null`
   * if the bus is in an indeterminate state (such as the case when it is connected
   * to a {@link TriState} and the impede signal is set.)
   */
  getValue(): BitString | null {
    return this.#value;
  }

  /**
   * Get the fixed width of this circuit bus.
   *
   * > [!NOTE] This method may seem redundant because it also exists on {@link BitString},
   * > but you can't always call {@link BitString.getWidth} if there is no {@link BitString}
   * > value set on this bus. That is, `getValue().getWidth()` may not work because
   * > `getValue()` could potentially be undefined. This method, however, will always return
   * > the width of the bus even if there is no value on it.
   * >
   * > When the bus _does_ have a value, it is guaranteed that
   * > `getValue().getWidth() === getWidth()`, thanks to the behavior of {@link setValue}.
   * @returns The width of the bus, in the number of bits.
   */
  getWidth(): number {
    return this.#width;
  }
}
