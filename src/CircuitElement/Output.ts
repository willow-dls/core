import { CircuitElement } from "../CircuitElement";
import { CircuitBus } from "../CircuitBus";
import { BitString } from "../BitString";
import { LogLevel } from "../CircuitLogger";

export class Output extends CircuitElement {
  #index: number;
  #label: string;
  #value: BitString | null;

  constructor(index: number, label: string, input: CircuitBus) {
    super("OutputElement", [input], []);
    this.#index = index;
    this.#label = label;
    this.#value = null;
  }

  getIndex(): number {
    return this.#index;
  }

  getLabel(): string {
    return this.#label;
  }

  setValue(value: BitString) {
    this.#value = value;

    const inputs = this.getInputs();
    inputs.forEach((i) => i.setValue(value));
    this.log(
      LogLevel.TRACE,
      `Directly received new value ${value}, propagated to inputs.`,
    );
  }

  getValue(): BitString | null {
    return this.#value;
  }

  resolve(): number {
    const inputs = this.getInputs();
    inputs.forEach((i) => (this.#value = i.getValue()));
    return this.getPropagationDelay();
  }

  getOutputs(): CircuitBus[] {
    return this.getInputs();
  }

  reset() {
    this.#value = null;
  }
}
