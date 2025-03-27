import { CircuitBus } from "./CircuitBus";
import { CircuitLoggable } from "./CircuitLogger";

/**
 * A circuit element is a component in a circuit. It represents the fundamental unit of a
 * circuit and is connected via {@link CircuitBus}s. Elements can be logic gates or more
 * complex combinatorial elements. They can even represent sequential elements, though
 * sequential elements are much more complex and require much greater care when implementing.
 * 
 * A circuit elements takes its inputs via {@link CircuitBus}es, processes them via the
 * {@link resolve} function, and outputs the results via its output {@link CircuitBus}es.
 * This model seems to work well for most elements, but some bi-directional elements require
 * particularly tricky workarounds, such as {@link Splitter}.
 */
export abstract class CircuitElement extends CircuitLoggable {
  #inputs: CircuitBus[];
  #outputs: CircuitBus[];

  #propagationDelay: number;
  #label: string | null;

  /**
   * Construct 
   * @param subsystem 
   * @param inputs 
   * @param outputs 
   */
  constructor(
    subsystem: string = "Element",
    inputs: CircuitBus[],
    outputs: CircuitBus[],
  ) {
    super(subsystem);
    this.#inputs = inputs;
    this.#outputs = outputs;

    this.#inputs.forEach((i) => i.connectElement(this));
    this.#outputs.forEach((i) => i.connectElement(this));

    this.#propagationDelay = 0;
    this.#label = null;
  }

  abstract resolve(): number;

  getInputs(): CircuitBus[] {
    return this.#inputs;
  }

  getOutputs(): CircuitBus[] {
    return this.#outputs;
  }

  reset(): void {
    // This method is expected to be overridden by child
    // elements who may have internal state they which to reset
    // when the circuit is re-run with new inputs.
    //
    // (For example, the Splitter element, which must retain a history
    // of its inputs and outputs to know which direction to propagate,
    // since it is bi-directional.)
    this.getInputs().forEach((i) => i.setValue(null, -1));
    this.getOutputs().forEach((o) => o.setValue(null, -1));
  }

  setPropagationDelay(delay: number): CircuitElement {
    this.#propagationDelay = delay;
    return this;
  }

  setLabel(label: string): CircuitElement {
    this.#label = label;
    return this;
  }

  protected getPropagationDelay(): number {
    return this.#propagationDelay;
  }

  getLabel(): string | null {
    return this.#label;
  }

  toString() {
    return `${this.constructor.name}[id=${this.getId()}]${this.#label ? `('${this.#label}')` : ""}`;
  }
}
