import { CircuitElement } from "../CircuitElement";
import { CircuitBus } from "../CircuitBus";
import { BitString } from "../BitString";
import { LogLevel } from "../CircuitLogger";

/**
 * The output element is the primary means of interfacing with a circuit. It
 * allows you to extract data out of the circuit being evaluated, and makes provisions
 * for reading bus values directly in code. Well-crafted circuits will contain ample
 * outputs which can be populated with values and retrieved by label via {@link Circuit.run}.
 * See the documentation for that method for the normal way of retrieving outputs from
 * circuits.s
 */
export class Output extends CircuitElement {
  #index: number;
  #label: string;
  #value: BitString | null;

  /**
   * Constructs an instance of the OutputElement class.
   *
   * @param index The index of the output element. See {@link Input}'s `index`
   * parameter.
   * @param label A string representing the label of the output element.
   * See {@link Input}'s `label` parameter.
   * @param input The input bus connected to this output element.
   */
  constructor(index: number, label: string, input: CircuitBus) {
    super("OutputElement", [input], []);
    this.#index = index;
    this.#label = label;
    this.#value = null;
  }

  /**
   * Get the index of this output.
   * @returns The index number that was passed into the constructor.
   */
  getIndex(): number {
    return this.#index;
  }

    /**
   * Set the index of this output. This function is used to ensure the proper
   * functionality of subcircuits.
   * 
   * > [!WARNING]
   * > This is intended to be used by {@link CircuitLoader}s only.
   * > You should never call this function from code outside of a loader
   * > implementation.
   * 
   * @param index The new index.
   * @returns This output for method chaining.
   */
  setIndex(index: number): Output {
    this.#index = index;
    return this;
  }

  /**
   * Get the label of this output.
   * @returns The label string that was passed into the constructor.
   */
  getLabel(): string {
    return this.#label;
  }

  /**
   * Set a new value for this output, which will be back-propagated to the
   * circuit. This is a hack that allows users to set the state of sequential
   * circuits properly.
   * @param value The value to send to the input buses.
   */
  setValue(value: BitString) {
    this.#value = value;

    const inputs = this.getInputs();
    inputs.forEach((i) => i.setValue(value));
    this.log(
      LogLevel.TRACE,
      `Directly received new value ${value}, propagated to inputs.`,
    );
  }

  /**
   * Get this output's value.
   * @returns The value on the input bus connected to this output.
   */
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
