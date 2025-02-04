import { CircuitElement } from "./CircuitElement";
import { Input } from "./CircuitElement/Input";
import { Output } from "./CircuitElement/Output";
import { CircuitNode } from "./CircuitNode";

export class Circuit {
    #nodes: CircuitNode[];
    #elements: CircuitElement[];

    #inputs: Record<string, CircuitElement>;
    #outputs: Record<string, CircuitElement>;

    constructor(nodes: CircuitNode[], elements: CircuitElement[]) {
        this.#nodes = nodes;
        this.#elements = elements;

        this.#inputs = {};
        this.#outputs = {};

        elements.forEach(e => {
            if (e instanceof Input) {
                if (this.#inputs[e.getLabel()]) {
                    throw new Error(`Multiple inputs with the same label: ${e.getLabel()}`);
                }
                this.#inputs[e.getLabel()] = e;
            }

            if (e instanceof Output) {
                if (this.#outputs[e.getLabel()]) {
                    throw new Error(`Multiple outputs with the same label: ${e.getLabel()}`);
                }
                this.#outputs[e.getLabel()] = e;
            }
        });
    }

    run(inputs: Record<string, number>): Record<string, number> {
        throw new Error('Not implemented.');
    }
}