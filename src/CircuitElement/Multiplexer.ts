import { CircuitElement } from "../CircuitElement";
import { CircuitBus } from "../CircuitBus";
import { BitString } from "../BitString";

export class Multiplexer extends CircuitElement {

    #controlSignal


    constructor(inputs: CircuitBus[], outputs: CircuitBus[], controlSignal: CircuitBus) {
        super('Element', inputs, outputs);
        this.#controlSignal = controlSignal
    }



    resolve(): number {
        const inputs = this.getInputs();
        const inputValues = inputs.map(i => i.getValue());
        const control = this.#controlSignal.getValue()
        const result = inputValues[control.toUnsigned()]

        const outputs = this.getOutputs();
        outputs.forEach(o => o.setValue(result));
        return 0;
    }
}