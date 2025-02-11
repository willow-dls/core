import { CircuitElement } from "./CircuitElement";
import { Input } from "./CircuitElement/Input";
import { Output } from "./CircuitElement/Output";
import { CircuitNode } from "./CircuitNode";

export type CircuitRunType = Record<string, number> | number[];
export type CircuitRunResult<T extends CircuitRunType> = {
    outputs: T,
    propagationDelay: number;
};

export class Circuit {
    #elements: CircuitElement[];

    #inputs: Record<string, Input>;
    #outputs: Record<string, Output>;

    #id: string;
    #name: string;

    constructor(id: string, name: string, elements: CircuitElement[]) {
        this.#elements = elements;

        this.#inputs = {};
        this.#outputs = {};

        this.#name = name;
        this.#id = id;

        elements.forEach(e => {
            if (e instanceof Input) {
                if (this.#inputs[e.getLabel()]) {
                    throw new Error(`Multiple inputs with the same label: '${e.getLabel()}'.`);
                }
                this.#inputs[e.getLabel()] = e;
            }

            if (e instanceof Output) {
                if (this.#outputs[e.getLabel()]) {
                    throw new Error(`Multiple outputs with the same label: '${e.getLabel()}'.`);
                }
                this.#outputs[e.getLabel()] = e;
            }
        });
    }

    getName(): string {
        return this.#name;
    }

    getId(): string {
        return this.#id;
    }

    run<T extends CircuitRunType>(inputs: T): CircuitRunResult<T> {
        // Set circuit inputs
        if (Array.isArray(inputs)) {
            Object.values(this.#inputs).forEach(input => {
                const value = inputs[input.getIndex()];
                input.setValue(value);
            });
        } else {
            const inputLabels = Object.keys(inputs);
            for (const i in inputLabels) {
                const key = inputLabels[i];

                if (this.#inputs[key] === undefined) {
                    throw new Error(`Circuit does not have input with label '${key}'.`);
                }

                this.#inputs[key].setValue(inputs[key]);
            }
        }

        // Execute circuit simulation

        // Return circuit outputs

        throw new Error('Not implemented.');
    }
}