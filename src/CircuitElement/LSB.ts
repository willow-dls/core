import { CircuitElement } from "../CircuitElement";
import { CircuitBus } from "../CircuitBus";
import { BitString } from "../BitString";

export class LSB extends CircuitElement {
  readonly ENABLE_WIDTH: number = 1;

  constructor(inputs: CircuitBus[], outputs: CircuitBus[]) {
    super("LSBElement", inputs, outputs);
  }

  resolve(): number {
    const inputs = this.getInputs();
    const outputs = this.getOutputs();

    const inputString = inputs[0].getValue().toString();
    const inputWidth = inputs[0].getValue().getWidth();

    for (let i = 0; i < inputString.length - 1; i++) {
      if (inputString[i] == '1') {
        outputs[0].setValue(new BitString(i.toString(2), inputWidth));

        // Set ENABLE to HIGH if an LSB was found
        outputs[1].setValue(new BitString("1", this.ENABLE_WIDTH));

        return 10;
      }
    }

    outputs[0].setValue(new BitString("0", inputWidth));
    outputs[1].setValue(new BitString("0", this.ENABLE_WIDTH));

    return 10;
  }
}
