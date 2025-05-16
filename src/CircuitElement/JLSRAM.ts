import { BitString } from "../BitString";
import { CircuitBus } from "../CircuitBus";
import { Memory } from "./Memory";

export class JLSRAM extends Memory {
  constructor(
    address: CircuitBus,
    data: CircuitBus,
    output: CircuitBus,
    enable: CircuitBus,
    chipSelect: CircuitBus,
    writeEnable: CircuitBus,
    size: number,
    wordSize: number,
    initialData: BitString[],
  ) {
    super(
      "JLSRAMElement",
      [address, data, enable, chipSelect, writeEnable],
      [output],
      size,
      wordSize,
      initialData,
    );
  }

  resolve(): number {
    const [address, data, enable, chipSelect, writeEnable] = this.getInputs();
    const [output] = this.getOutputs();

    // "The output of a memory element is tri-state, and is enabled whenever both CS and OE are 0."
    if (
      BitString.low().equals(chipSelect.getValue()) &&
      BitString.low().equals(enable.getValue())
    ) {
      const idx = address.getValue()?.toUnsigned();
      if (idx) {
        if (idx > this.data.length) {
          output.setValue(BitString.high(this.wordSize));
        } else {
          output.setValue(this.data[idx]);
        }
      }
    } else {
      output.setValue(null);
    }

    // "If CS and WE become 0, then a write will be initiated using the current values of the address
    // and data inputs. If CS and WE are already 0 and either the address or data input changes, a
    // write will be initiated."
    if (
      BitString.low().equals(chipSelect.getValue()) &&
      BitString.low().equals(writeEnable.getValue())
    ) {
      const idx = address.getValue()?.toUnsigned();
      if (idx && idx < this.data.length) {
        this.data[idx] = data.getValue() ?? BitString.low(this.wordSize);
      }
    }

    return this.getPropagationDelay();
  }
}
