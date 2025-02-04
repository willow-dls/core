import { CircuitNode } from "./CircuitNode";

export abstract class CircuitElement {
    #inputs: CircuitNode[];
    #outputs: CircuitNode[];

    #propagationDelay: number;

    constructor(
        propagationDelay: number = 0,
        inputs: CircuitNode[] = [], 
        outputs: CircuitNode[] = []
    ) {
        this.#propagationDelay = propagationDelay;
        this.#inputs = inputs;
        this.#outputs = outputs;
    }

    getPropagationDelay(): number {
        return this.#propagationDelay;
    }

    resolve(): (() => void) | null {
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
            this.run(this.#inputs, this.#outputs);
        };
    }

    abstract run(inputs: CircuitNode[], outputs: CircuitNode[]): void;
}