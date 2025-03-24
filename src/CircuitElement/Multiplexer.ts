import { BitString } from "../BitString";
import { CircuitElement } from "../CircuitElement";
import { CircuitBus } from "../CircuitBus";
import { Circuit } from "../Circuit";

export class Multiplexer extends CircuitElement {
  #controlSignal: CircuitBus;

  constructor(
    inputs: CircuitBus[],
    outputs: CircuitBus[],
    controlSignal: CircuitBus,
  ) {
    super("MultiplexerElement", inputs, outputs);

    this.#controlSignal = controlSignal;
  }

  resolve(): number {
    const inputs = this.getInputs();
    const [output] = this.getOutputs();

    const controlValue = this.#controlSignal.getValue();

    if (!controlValue) {
      return this.getPropagationDelay();
    }

    const controlSignalVal = controlValue.toUnsigned();

    if (controlSignalVal >= inputs.length) {
      throw new Error(
        `Multiplexer control signal is set to '${controlSignalVal}', but only has ${inputs.length} inputs.`,
      );
    } else {
      output.setValue(inputs[controlSignalVal].getValue());
    }

    return this.getPropagationDelay();
  }
}
