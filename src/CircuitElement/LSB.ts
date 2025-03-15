import { CircuitElement } from "../CircuitElement";
import { CircuitBus } from "../CircuitBus";
import { BitString } from "../BitString";
import { LogLevel } from "../CircuitLogger";

export class LSB extends CircuitElement {
  readonly ENABLE_WIDTH: number = 1;

  constructor(input: CircuitBus, output: CircuitBus, enable: CircuitBus) {
    super("LSBElement", [input], [output, enable]);
  }

  resolve(): number {
    const [input] = this.getInputs();
    const [output, enable] = this.getOutputs();

    const inputValue = input.getValue();

    if (!inputValue) {
      output.setValue(BitString.low());
      enable.setValue(BitString.low());
      return this.getPropagationDelay();
    }

    const inputString = inputValue.toString();
    const inputWidth = inputValue.getWidth();

    this.log(LogLevel.TRACE, `Input: [width=${inputWidth}] '${inputString}'`);

    for (let i = 0; i < inputWidth; i++) {
      if (inputString[i] == '1') {
        const lsb = new BitString((inputWidth- i - 1).toString(2), inputWidth);
        this.log(LogLevel.TRACE, `LSB found at index: '${lsb}'`);
        output.setValue(lsb);
        
        // Set ENABLE to HIGH if an LSB was found
        enable.setValue(new BitString("1", this.ENABLE_WIDTH));

        return this.getPropagationDelay();
      }
    }

    this.log(LogLevel.TRACE, `No LSB found.`);
    output.setValue(BitString.low(inputWidth));
    enable.setValue(BitString.low(this.ENABLE_WIDTH));

    return this.getPropagationDelay();
  }
}
