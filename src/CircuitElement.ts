import { CircuitBus } from "./CircuitBus";
import { CircuitLoggable } from "./CircuitLogger";

export abstract class CircuitElement extends CircuitLoggable {
    #inputs: CircuitBus[];
    #outputs: CircuitBus[];

    constructor(
        subsystem: string = 'Element',
        inputs: CircuitBus[] = [], 
        outputs: CircuitBus[] = []
    ) {
        super(subsystem);
        this.#inputs = inputs;
        this.#outputs = outputs;

        this.#inputs.forEach(i => i.connectElement(this));
        this.#outputs.forEach(i => i.connectElement(this));
    }

    abstract resolve(): number;

    getInputs(): CircuitBus[] {
        return this.#inputs;
    }

    getOutputs(): CircuitBus[] {
        return this.#outputs;
    }
}