import { BitString } from "./BitString";
import { CircuitElement } from "./CircuitElement";

export class CircuitBus {
    #connections: CircuitBus[];
    #elements: CircuitElement[];
    #value: BitString;

    constructor(bitWidth: number, ...connections: CircuitBus[]) {
        this.#connections = connections;
        this.#value = BitString.from('0', bitWidth);
        this.#elements = [];
    }

    getBitWidth(): number {
        return this.#value.getWidth();
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

    setValue(value: BitString): void {
        if (value.equals(this.#value)) {
            return;
        }
        
        this.#value = value;
        // Propagate value to connected nodes.
        this.#connections.forEach(c => c.setValue(value));
    }

    getValue(): BitString {
        return this.#value;
    }
}