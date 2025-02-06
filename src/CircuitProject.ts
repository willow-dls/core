import { Circuit } from "./Circuit";

export class CircuitProject {
    #circuits: Circuit[];

    #nameIndex: Record<string, Circuit>;
    #idIndex: Record<string, Circuit>;

    constructor(...ciruits: Circuit[]) {
        this.#circuits = ciruits;

        this.#nameIndex = {};
        this.#idIndex = {};

        this.#index();
    }

    #index() {
        this.#circuits.forEach(circuit => {
            this.#nameIndex[circuit.getName()] = circuit;
            this.#idIndex[circuit.getId()] = circuit;
        });
    }

    getCircuitByName(name: string): Circuit {
        if (!this.#nameIndex[name]) {
            throw new Error(`No circuit in this project named: ${name}`);
        }

        return this.#nameIndex[name];
    }

    getCircuitById(id: any): Circuit {
        if (!this.#idIndex[id]) {
            throw new Error(`No circuit in this project with ID: ${id}`);
        }

        return this.#idIndex[id];
    }

    getCircuits(): Circuit[] {
        return this.#circuits;
    }

    addCircuit(circuit: Circuit) {
        this.#circuits.push(circuit);
        this.#index();
    }
}