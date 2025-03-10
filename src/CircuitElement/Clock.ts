import { CircuitElement } from "../CircuitElement";
import { CircuitBus } from "../CircuitBus";
import { BitString } from "../BitString";

export class Clock extends CircuitElement {
    #inputCycler: BitString
    #cycleTime: number

    constructor(newInput: CircuitBus, outputs: CircuitBus[], timer: number = 500) {
        outputs[0].connect(newInput)
        const inputs = []
        inputs.push(newInput)
        super('clockElement', inputs, outputs);
        this.#inputCycler = newInput.getValue();
        this.#cycleTime = timer;
    }


    resolve(): number {
        const result = this.#inputCycler.not();
        const outputs = this.getOutputs();
        outputs.forEach(o => o.setValue(result));
        return this.#cycleTime;
    }
}



