import { CircuitElement } from "../CircuitElement";
import { CircuitBus } from "../CircuitBus";
import { BitString } from "../BitString";
import { LogLevel } from "../CircuitLogger";

export class MSB extends CircuitElement {
  readonly ENABLE_WIDTH: number = 1;

  constructor(input: CircuitBus, output: CircuitBus, enable: CircuitBus) {
    super("MSBElement", [input], [output, enable]);
  }

  resolve(): number {
    const [input] = this.getInputs();
    const [output, enable] = this.getOutputs();

    const inputString = input.getValue().toString();
    const inputWidth = input.getValue().getWidth();

    this.log(LogLevel.TRACE, `Input: [width=${inputWidth}] '${inputString}'`);

    for (let i = inputWidth; i > 0; i--) {
      if (inputString[i] == '1') {
        const msb = new BitString((inputWidth- i - 1).toString(2), inputWidth);
        this.log(LogLevel.TRACE, `MSB found at index: '${msb}'`);
        output.setValue(msb);
        
        // Set ENABLE to HIGH if an MSB was found
        enable.setValue(new BitString("1", this.ENABLE_WIDTH));

        return 10;
      }
    }

    this.log(LogLevel.TRACE, `No MSB found.`);
    output.setValue(BitString.low(inputWidth));
    enable.setValue(BitString.low(this.ENABLE_WIDTH));

    return 10;
  }
}
