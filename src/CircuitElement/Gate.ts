import { CircuitElement } from "../CircuitElement";
import { CircuitBus } from "../CircuitBus";
import { BitString } from "../BitString";

export abstract class Gate extends CircuitElement {
    constructor(inputs: CircuitBus[], outputs: CircuitBus[]) {
        super('GateElement', inputs, outputs);
    }

    resolve(): number {
        const inputs = this.getInputs();
        const outputs = this.getOutputs();

        // // If there are null inputs, we can't evaluate this circuit
        // // in any meaningful way.
        // if (inputs.filter(i => i.getValue() == null).length > 0) {
        //     outputs.forEach(o => o.setValue(BitString.low()));
        //     return this.getPropagationDelay();
        // }

        const inputValues = inputs.map(i => i.getValue());
        const result: BitString | null = 
            inputValues.length == 1 
            ? this.evaluate(BitString.low(), inputValues[0] as BitString) 
            : inputValues.slice(1).reduce((prev, cur) => this.evaluate(prev ?? BitString.low(), cur ?? BitString.low()), inputValues[0]);
        
        outputs.forEach(o => o.setValue(result));

        return this.getPropagationDelay();
    }

    abstract evaluate(previousValue: BitString, currentValue: BitString): BitString;
}