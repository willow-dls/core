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

import { loadProject } from "../src/CircuitLoader";
import { CircuitVerseLoader } from "../src/CircuitLoader/CircuitVerseLoader";

test("CircuitProject fail to get circuit by name", async () => {
  const project = await loadProject(CircuitVerseLoader, "tests/cv/Simple.cv");

  expect(() => project.getCircuitByName("blah-blah")).toThrow(
    "No circuit in this project",
  );
});

test("CircuitProject fail to get circuit by ID", async () => {
  const project = await loadProject(CircuitVerseLoader, "tests/cv/Simple.cv");

  expect(() => project.getCircuitById("blah-blah")).toThrow(
    "No circuit in this project",
  );
});

test("CircuitProject.getCircuits()", async () => {
  let project = await loadProject(CircuitVerseLoader, "tests/cv/Simple.cv");
  expect(project.getCircuits().length).toBe(3);

  project = await loadProject(CircuitVerseLoader, "tests/cv/InfiniteLoop.cv");
  expect(project.getCircuits().length).toBe(1);
});
