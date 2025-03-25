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

    const inputValue = input.getValue();

    if (!inputValue) {
      output.setValue(BitString.low());
      enable.setValue(BitString.low());
      return this.getPropagationDelay();
    }

    const inputString = inputValue.toString();
    const inputWidth = input.getWidth();

    this.log(LogLevel.TRACE, `Input: [width=${inputWidth}] '${inputString}'`);

    for (let i = 0; i < inputWidth; i++) {
      if (inputString[i] == "1") {
        const msb = new BitString((inputWidth - i - 1).toString(2), inputWidth);
        this.log(LogLevel.TRACE, `MSB found at index: '${msb}'`);
        output.setValue(msb);

        // Set ENABLE to HIGH if an MSB was found
        enable.setValue(new BitString("1", this.ENABLE_WIDTH));

        return this.getPropagationDelay();
      }
    }

    this.log(LogLevel.TRACE, `No MSB found.`);
    output.setValue(BitString.low(inputWidth));
    enable.setValue(BitString.low(this.ENABLE_WIDTH));

    return this.getPropagationDelay();
  }
}
