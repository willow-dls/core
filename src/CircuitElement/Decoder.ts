import { CircuitElement } from "../CircuitElement";
import { CircuitBus } from "../CircuitBus";
import { BitString } from "../BitString";
import { LogLevel } from "../CircuitLogger";

export class Decoder extends CircuitElement {
  readonly ENABLE_WIDTH: number = 1;

  constructor(input: CircuitBus, output: CircuitBus[]) {
    super("PriorityEncoderElement", [input], output);
  }

  resolve(): number {
    const [input] = this.getInputs();
    const output = this.getOutputs();
    const inputValue = input.getValue();

    if (!inputValue) {
        for(let i = 0; i < output.length; i++){
            output[i].setValue(BitString.low());
        }
        return this.getPropagationDelay();
    }

    const inputString = inputValue.toString();
    const inputWidth = input.getWidth()
    const inputNum = inputValue.toUnsigned();
    this.log(LogLevel.TRACE, `Input: [width=${inputWidth}] '${inputString}'`);

    for(let i = 0; i < output.length; i++){
        if(i == inputNum){
            output[i].setValue(BitString.high());
        }
        else{
            output[i].setValue(BitString.low());
        }
        
    }
        return this.getPropagationDelay();
      
    

    // this.log(LogLevel.TRACE, `No Priority Encoder found.`);
    // for(let i = 0; i < output.length; i++){
    //     output[i].setValue(BitString.low());
    // }
    // return this.getPropagationDelay();
  }
}
