import { CircuitBus } from "./CircuitBus";

export abstract class CircuitElement {
    #inputs: CircuitBus[];
    #outputs: CircuitBus[];

    constructor(
        inputs: CircuitBus[] = [], 
        outputs: CircuitBus[] = []
    ) {
        this.#inputs = inputs;
        this.#outputs = outputs;

        this.#inputs.forEach(i => i.connectElement(this));
        this.#outputs.forEach(i => i.connectElement(this));
    }

    abstract resolve(): number;

    getInputs(): CircuitBus[] {
        return this.#inputs
    }

    getOutputs(): CircuitBus[] {
        return this.#outputs;
    }
}