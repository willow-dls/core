import { CircuitElement } from "../CircuitElement";
import { CircuitBus } from "../CircuitBus";
import { BitString } from "../BitString";

export class LSB extends CircuitElement {

  constructor(inputs: CircuitBus[], outputs: CircuitBus[]) {
    super("LSB", inputs, outputs);
  }

  resolve(): number {
    const inputs = this.getInputs();
    const outputs = this.getOutputs();

    const inputString = inputs[0].getValue().toString();

    console.log(inputString)

    for (let i = inputString.length - 1; i > 0; i++) {
      if (inputString[i] == '1') {
        outputs[0].setValue(new BitString(String(i)));

        // Set the ENABLE output if it exists
        if (outputs.length > 1) {
          outputs[1].setValue(new BitString(String(1)));
        }
        return 10;
      }
    }

    outputs[0].setValue(new BitString("0"));
    outputs[1].setValue(new BitString("0"));

    return 10;
  }
}
