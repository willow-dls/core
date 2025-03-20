import { BitString } from "./BitString";
import { CircuitElement } from "./CircuitElement";

export class CircuitBus {
    #connections: CircuitBus[];
    #elements: CircuitElement[];
    #value: BitString | null;
    #width: number;
    #lastUpdate: number;

    constructor(bitWidth: number, ...connections: CircuitBus[]) {
        this.#connections = connections;
        this.#width = bitWidth;
        this.#elements = [];
        this.#value = null;
        this.#lastUpdate = -1;
    }

    connect(node: CircuitBus): void {
        if (this.#elements.length > 0) {
            throw new Error("Cannot connect a circuit bus after elements have been added.");
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

    setValue(value: BitString | null, lastUpdate?: number): void {
        if (value == this.#value) {
            return;
        }

        if (value) {
            if (value.equals(this.#value)) {
                return;
            }

            if (value.getWidth() > this.#width) {
                throw new Error(`Bus error: Attempting to set ${value.getWidth()}-bit value '${value}' on ${this.#width}-bit bus, currently holding '${this.#value}'.`);
            }

            if (value.getWidth() < this.#width) {
                value = value.pad(this.#width);
            }
        }
        
        this.#value = value;
        // Propagate value to connected nodes.
        this.#connections.forEach(c => c.setValue(value, lastUpdate));

        if (lastUpdate !== undefined) {
            this.setLastUpdate(lastUpdate);
        }
    }

    setLastUpdate(t: number): void {
        if (this.#lastUpdate == t) {
            return;
        }

        this.#lastUpdate = t;
        // Propagate value to connected nodes.
        this.#connections.forEach(c => c.setLastUpdate(t));
    }

    getLastUpdate(): number {
        return this.#lastUpdate;
    }

    getValue(): BitString | null {
        return this.#value;
    }

    getWidth(): number {
        return this.#width;
    }
}