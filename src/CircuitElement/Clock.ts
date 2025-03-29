import { BitString } from "../BitString";
import { CircuitBus } from "../CircuitBus";
import { CircuitElement } from "../CircuitElement";

/**
 * The clock element allows the simulation engine to iteratively run the
 * simulation and provide a clock signal in the process. The clock element
 * is somewhat unique in that it is heavily integrated with the circuit
 * engine because the engine needs to invoke methods like {@link tick}
 * in a loop and then propagate the clock signal to the circuit being
 * run.
 *
 * The clock should generally not be modified directly by end users; rather
 * the simulation event loop will automatically tick the clock as appropriate.
 */
export class Clock extends CircuitElement {
  #value: BitString;

  /**
   * Create a new clock.
   * @param output The clock signal will be output on this bus.
   */
  constructor(output: CircuitBus) {
    super("ClockElement", [], [output]);

    this.#value = BitString.low();
  }

  resolve(): number {
    const [output] = this.getOutputs();
    output.setValue(this.#value);

    return this.getPropagationDelay();
  }

  /**
   * Set the clock signal high for the next call of {@link resolve}.
   */
  setHigh(): void {
    this.#value = BitString.high();
  }

  /**
   * Set the clock signal low for the next call of {@link resolve}.
   */
  setLow(): void {
    this.#value = BitString.low();
  }

  /**
   * Invert the clock signal for the next call of {@link resolve}. That is,
   * if it was high, set it low, and if it was low, set it high. This method
   * internally uses {@link setHigh} and {@link setLow} and is the only method
   * used by the simulation engine.
   *
   * The other are made public for future use, but aren't used at this time.
   */
  tick(): void {
    if (this.#value.equals(BitString.low())) {
      this.setHigh();
    } else {
      this.setLow();
    }
  }
}
