import { CircuitBus } from "../CircuitBus";
import { CircuitElement } from "../CircuitElement";
import { LogLevel } from "../CircuitLogger";

export class TriState extends CircuitElement {
    constructor(input: CircuitBus, state: CircuitBus,  output: CircuitBus) {
        super('TriStateElement', [input, state], [output]);
    }

    resolve(): number {
        const state = this.getInputs()[1];
        const output = this.getOutputs()[0];

        if (state.getValue()?.equals('1')) {
            const input = this.getInputs()[0];

            this.log(LogLevel.TRACE, `State is high, passing through input: ${input.getValue()}`);

            output.setValue(input.getValue());
        } else {
            this.log(LogLevel.TRACE, `State is low, impeding output.`);
            output.setValue(null);
        }

        return this.getPropagationDelay();
    }
}