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

import { expect, beforeAll, test } from "@jest/globals";

import { CircuitBus } from "../src/CircuitBus";
import { OrGate } from "../src/CircuitElement/OrGate";

// test('Bit width error', () => {
//     expect(loadProject(CircuitVerseLoader, 'tests/cv/BitWidthError.cv')).rejects.toBe('error');
// });

test("Connections", () => {
  const bus1 = new CircuitBus(4);
  const bus2 = new CircuitBus(4, bus1);

  const bus3 = new CircuitBus(4);

  const gate = new OrGate([], []);

  bus2.connectElement(gate);

  expect(() => bus2.connect(bus3)).toThrow("Cannot connect");

  expect(bus1.getConnections().length).toBe(0);
  expect(bus2.getConnections().length).toBe(1);
  expect(bus3.getConnections().length).toBe(0);
});
