export class CircuitNode {
    #bitWidth: number;
    #connections: Node[];
    #value: number | undefined;

    constructor(bitWidth: number, ...connections: Node[]) {
        this.#bitWidth = bitWidth;
        this.#connections = connections;
    }

    getBitWidth(): number {
        return this.#bitWidth;
    }

    getConnections(): Node[] {
        return this.#connections;
    }

    hasValue(): boolean {
        return this.#value !== undefined;
    }

    setValue(value: number): void {
        this.#value = value;
    }

    getValue(): number {
        if (!this.hasValue()) {
            throw new Error('Attempt to retrieve value on node before it has one.');
        }

        return this.#value as number;
    }
}