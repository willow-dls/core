import { Circuit } from "../Circuit";
import { CircuitElement } from "../CircuitElement";
import { CircuitBus } from "../CircuitBus";
import { LogLevel } from "../CircuitLogger";
import { Clock } from "./Clock";

/**
 * Most circuit simulation libraries support the concept of "subcircuits," which are
 * a way to embed an entire circuit as an element in another circuit. This class implements
 * that functionality, allowing an entire {@link Circuit} to be added as an element in another
 * {@link Circuit}.
 */
export class SubCircuit extends CircuitElement {
    #circuit: Circuit;

    /**
     * Create a new subcircuit.
     * @param circuit The circuit to convert to a ciruit element.
     * @param inputs The subcircuit inputs.
     * @param outputs The subcircuit outputs.
     */
    constructor(circuit: Circuit, inputs: CircuitBus[], outputs: CircuitBus[]) {
        super("SubCircuitElement", inputs, outputs);
        this.#circuit = circuit;
    }

    resolve(): number {
        this.log(
            LogLevel.DEBUG,
            `Executing Subcircuit: [id = ${this.#circuit.getId()}, name = '${this.#circuit.getName()}']`,
        );

        const inputs = this.getInputs();
        const outputs = this.getOutputs();

        const result = this.#circuit.resolve(inputs.map((node) => node.getValue()));

        result.outputs.forEach((value, index) => {
            outputs[index].setValue(value);
        });

        this.log(
            LogLevel.DEBUG,
            `Subcircuit complete: [id = ${this.#circuit.getId()}, name = '${this.#circuit.getName()}']`,
            result,
        );

        return result.propagationDelay;
    }

    /**
     * Retrieve an array of all the clocks in this subcircuit, recursively.
     * @returns All of the clocks in this circuit, so they can be set properly by the
     * {@link Circuit.run} function.
     */
    getClocks(): Clock[] {
        return this.#circuit.getClocks();
    }
}