import { CircuitElement } from "../CircuitElement";
import { CircuitBus } from "../CircuitBus";
import { BitString } from "../BitString";
import { LogLevel } from "../CircuitLogger";

export class LSB extends CircuitElement {
  readonly ENABLE_WIDTH: number = 1;

  constructor(input: CircuitBus, output: CircuitBus, enable: CircuitBus) {
    super("PriorityEncoder", [input], [output, enable]);
  }

  resolve(): number {
    const [input] = this.getInputs();
    const [output, enable] = this.getOutputs();

    const inputValue = input.getValue();
    const inputWidth = inputValue.getWidth();

    // Set ENABLE to high if *ANY* of the input's bits are high
    for (let i = 0; i < inputWidth; i++) {
        if (inputValue.toString()[i] == "1") {
            enable.setValue(BitString.high())
            break;
        }
    }

    return 10;
  }
}
