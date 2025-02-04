export class CircuitNode {
    #bitWidth: number;
    #connections: CircuitNode[];
    #value: number | undefined;

    constructor(bitWidth: number, ...connections: CircuitNode[]) {
        this.#bitWidth = bitWidth;
        this.#connections = connections;
    }

    getBitWidth(): number {
        return this.#bitWidth;
    }

    getConnections(): CircuitNode[] {
        return this.#connections;
    }

    hasValue(): boolean {
        return this.#value !== undefined;
    }

    setValue(value: number): void {
        this.#value = value;
        // Propagate value to connected nodes.
        this.#connections.forEach(c => c.setValue(value));
    }

    getValue(): number {
        if (!this.hasValue()) {
            throw new Error('Attempt to retrieve value on node before it has one.');
        }

        return this.#value as number;
    }
}