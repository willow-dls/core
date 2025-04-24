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

import { Circuit } from "./Circuit";
import { CircuitLoggable } from "./CircuitLogger";

/**
 * A Circuit Project is a collection of circuits which may or may not be
 * interdependent on one onother. Projects may consist of a circuit and all
 * of its subcircuits, or a collection of totally unrelated circuits.
 *
 * "Projects" are a concept which came from CircuitVerse, where a project
 * is a file, and ciruits are tabs in the CircuitVerse UI when the file is
 * loaded.
 *
 * This class will probably not be instantiated manually in end-user code;
 * rather, the project loader (see {@link loadProject} and {@link CircuitLoader})
 * will parse circuit data and generate a project which compiles any circuits
 * contained within that data.
 *
 * This class is simply a data class for managing circuits, it does not perform
 * any logic of its own. The most commonly used methods will probably be
 * {@link getCircuitById} and {@link getCircuitByName}, as these allow you to
 * fetch circuits and then actually execute them.
 *
 * > [!NOTE] Not all {@link CircuitLoader}s may support fetching a circuit by
 * > name. In those cases, you will have to fetch circuits by ID or by index
 * > in the array returned by {@link getCircuits}, which will return circuits in
 * > the same order for the same file.
 *
 * @author Jordan Bancino
 */
export class CircuitProject extends CircuitLoggable {
  #circuits: Circuit[];

  #nameIndex: Record<string, Circuit>;
  #idIndex: Record<string, Circuit>;

  /**
   * Create a new Circuit Project.
   *
   * @param ciruits An array of ciruits to initially create this project with.
   * Note that circuits can be added by calling {@link addCircuit}.
   */
  constructor(...ciruits: Circuit[]) {
    super("Project");

    this.#circuits = ciruits;

    this.#nameIndex = {};
    this.#idIndex = {};

    this.#index();
  }

  #index() {
    this.#circuits.forEach((circuit) => {
      this.#nameIndex[circuit.getName()] = circuit;
      this.#idIndex[circuit.getId()] = circuit;
      this.propagateLoggersTo(circuit);
    });
  }

  /**
   * Get a reference to a circuit by name.
   * @param name The name of the circuit to fetch.
   * @returns A reference to the circuit.
   * @throws Error if a circuit with the given name cannot be found.
   */
  getCircuitByName(name: string): Circuit {
    if (!this.#nameIndex[name]) {
      throw new Error(`No circuit in this project named: ${name}`);
    }

    return this.#nameIndex[name];
  }

  /**
   * Get a reference to a circuit by the internal ID used in the data file
   * it was loaded from.
   * @param id The ID of the circuit to fetch.
   * @returns  A reference to the circuit.
   * @throws Error if a circuit with the given ID cannot be found.
   */
  getCircuitById(id: any): Circuit {
    if (!this.#idIndex[id]) {
      throw new Error(`No circuit in this project with ID: ${id}`);
    }

    return this.#idIndex[id];
  }

  /**
   * Get all of the ciruits in this project, making no consideration for
   * which circuits are subcircuits or parent circuits.
   * @returns An array of all the circuits in this project.
   */
  getCircuits(): Circuit[] {
    return this.#circuits;
  }

  /**
   * Add a new circuit to this project. This will cause the project to re-index
   * itself, allowing thte circuit to  be identified by name and ID.
   * @param circuit The circuit to add to this project.
   */
  addCircuit(circuit: Circuit) {
    this.#circuits.push(circuit);
    this.#index();
  }
}
