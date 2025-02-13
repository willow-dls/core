import { CircuitNode } from "./CircuitNode";

export abstract class CircuitElement {
    #inputs: CircuitNode[];
    #outputs: CircuitNode[];

    constructor(
        inputs: CircuitNode[] = [], 
        outputs: CircuitNode[] = []
    ) {
        this.#inputs = inputs;
        this.#outputs = outputs;

        this.#inputs.forEach(i => i.connectElement(this));
        this.#outputs.forEach(i => i.connectElement(this));
    }

    abstract resolve(): number;

    getInputs(): CircuitNode[] {
        return this.#inputs
    }

    getOutputs(): CircuitNode[] {
        return this.#outputs;
    }
}