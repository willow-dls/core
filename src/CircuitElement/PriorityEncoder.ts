import { CircuitElement } from "../CircuitElement";
import { CircuitBus } from "../CircuitBus";
import { BitString } from "../BitString";
import { LogLevel } from "../CircuitLogger";

export class PriorityEncoder extends CircuitElement {
  readonly ENABLE_WIDTH: number = 1;
  #enableSignal : CircuitBus
  constructor(input: CircuitBus[], output: CircuitBus[], enable: CircuitBus) {
    super("PriorityEncoderElement", input, output);
    this.#enableSignal = enable;
  }

  resolve(): number {
    const input = this.getInputs();
    const output = this.getOutputs();

    let inputValues = []
    let inputString = []
    let validInputs = true
    for(let i = 0; i < input.length; i++){
        inputValues[i] = input[i].getValue();
        inputString[i] = inputValues[i]?.toString();
        if (!inputValues[i]){
            validInputs = false
        }
    }
   
    const enableValue = this.#enableSignal.getValue();

    if (!validInputs || enableValue == BitString.low()) {
        for(let i = 0; i < output.length; i++){
            output[i].setValue(BitString.low());
        }
    
    return this.getPropagationDelay();
    }


    const inputWidth = input.length

    this.log(LogLevel.TRACE, `Input: [width=${inputWidth}] '${inputString}'`);

    for (let i = inputWidth - 1; i >= 0; i--) {
      if (inputString[i] == '1') {
        let num = i
        for (let j = 0; j < output.length; j++){
            let r = num % 2
            num = Math.floor(num / 2)
            output[j].setValue(new BitString(r.toString()))
        }

        return this.getPropagationDelay();
      }
    }

    this.log(LogLevel.TRACE, `No Priority Encoder found.`);
    for(let i = 0; i < output.length; i++){
        output[i].setValue(BitString.low());
    }
    return this.getPropagationDelay();
  }
}
