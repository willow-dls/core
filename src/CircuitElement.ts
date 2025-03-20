import { CircuitBus } from "./CircuitBus";
import { CircuitLoggable } from "./CircuitLogger";

export abstract class CircuitElement extends CircuitLoggable {
    #inputs: CircuitBus[];
    #outputs: CircuitBus[];

    #propagationDelay: number;
    #label: string | null;

    constructor(
        subsystem: string = 'Element',
        inputs: CircuitBus[], 
        outputs: CircuitBus[]
    ) {
        super(subsystem);
        this.#inputs = inputs;
        this.#outputs = outputs;

        this.#inputs.forEach(i => i.connectElement(this));
        this.#outputs.forEach(i => i.connectElement(this));

        this.#propagationDelay = 0;
        this.#label = null;
    }

    abstract resolve(): number;

    getInputs(): CircuitBus[] {
        return this.#inputs;
    }

    getOutputs(): CircuitBus[] {
        return this.#outputs;
    }

    reset(): void {
        // This method is expected to be overridden by child
        // elements who may have internal state they which to reset
        // when the circuit is re-run with new inputs.
        //
        // (For example, the Splitter element, which must retain a history
        // of its inputs and outputs to know which direction to propagate,
        // since it is bi-directional.)
        this.getInputs().forEach(i => i.setValue(null, -1));
        this.getOutputs().forEach(o => o.setValue(null, -1));
    }

    setPropagationDelay(delay: number): CircuitElement {
        this.#propagationDelay = delay;
        return this;
    }

    setLabel(label: string): CircuitElement {
        this.#label = label;
        return this;
    }

    protected getPropagationDelay(): number {
        return this.#propagationDelay;
    }

    getLabel(): string | null {
        return this.#label;
    }

    toString() {
        return `${this.constructor.name}[id=${this.getId()}]${ this.#label ? `('${this.#label}')` : ''}`;
    }
}