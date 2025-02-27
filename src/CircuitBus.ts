import { CircuitElement } from "./CircuitElement";

export class CircuitBus {
    #bitWidth: number;
    #connections: CircuitBus[];
    #elements: CircuitElement[];
    #value: number;

    constructor(bitWidth: number, ...connections: CircuitBus[]) {
        this.#bitWidth = bitWidth;
        this.#connections = connections;
        this.#value = 0;
        this.#elements = [];
    }

    getBitWidth(): number {
        return this.#bitWidth;
    }

    connect(node: CircuitBus): void {
        if (this.#elements.length > 0) {
            throw new Error("Cannot connect circuit nodes after elements have been added.");
        }
        this.#connections.push(node);
    }

    getConnections(): CircuitBus[] {
        return this.#connections;
    }

    connectElement(element: CircuitElement): void {
        if (this.#elements.includes(element)) {
            return;
        }
        
        this.#elements.push(element);
        this.#connections.forEach(n => n.connectElement(element));
    }

    getElements(): CircuitElement[] {
        return this.#elements;
    }

    setValue(value: number): void {
        if (value == this.#value) {
            return;
        }
        
        this.#value = value;
        // Propagate value to connected nodes.
        this.#connections.forEach(c => c.setValue(value));
    }

    getValue(): number {
        return this.#value;
    }
}