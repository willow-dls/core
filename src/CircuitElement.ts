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
    }

    resolve(): (() => number) | null {
        const waiting = this.#inputs.filter(n => !n.hasValue());

        // We are waiting on inputs; cannot resolve.
        if (waiting.length > 0) {
            return null;
        }

        // This function is executed after the propagation delay
        // of the circuit to resolve the outputs. run() should
        // call setValue() on its output nodes to propagate
        // the changes to the next circuit depending on these.
        return () => {
            // Inputs are fully resolved, execute the circuit and produce
            // the outputs.
            return this.run(this.#inputs, this.#outputs);
        };
    }

    abstract run(inputs: CircuitNode[], outputs: CircuitNode[]): number;
}