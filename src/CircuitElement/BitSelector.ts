import { CircuitElement } from "../CircuitElement";
import { CircuitBus } from "../CircuitBus";
import { BitString } from "../BitString";
import { LogLevel } from "../CircuitLogger";

export class BitSelector extends CircuitElement {

  constructor(input: CircuitBus, output: CircuitBus, bitSelector: CircuitBus) {
    super("BitSelectorElement", [input, bitSelector], [output]);
  }

  resolve(): number {
    const [input, bitSelector] = this.getInputs();
    const [output] = this.getOutputs();

    const bitSelectorIndx = bitSelector.getValue().toUnsigned();
    const inputValue = input.getValue();
    const inputWidth = inputValue.getWidth()

    output.setValue(new BitString(inputValue.toString()[Math.abs(bitSelectorIndx - inputWidth + 1)]));

    this.log(LogLevel.TRACE, `Input: [width=${inputWidth}] '${inputValue.toString()}'`);

    return 10;
  }
}
