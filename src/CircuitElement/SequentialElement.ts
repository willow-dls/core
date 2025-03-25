import { BitString } from "../BitString";
import { CircuitBus } from "../CircuitBus";
import { CircuitElement } from "../CircuitElement";

export abstract class SequentialElement extends CircuitElement {
  #clock: CircuitBus;
  #lastClock: BitString | null;

  constructor(
    subsystem: string,
    clock: CircuitBus,
    inputs: CircuitBus[],
    outputs: CircuitBus[],
  ) {
    super(subsystem, [clock, ...inputs], outputs);

    this.#clock = clock;
    this.#lastClock = null;
  }

  resolve(): number {
    const clock = this.#clock.getValue();
    // If the clock has no value on it, do nothing.
    if (!clock) {
      return this.getPropagationDelay();
    }

    // If the last clock isn't set, assume it was low.
    if (!this.#lastClock) {
      this.#lastClock = BitString.low(clock.getWidth());
    }

    const lastClock = this.#lastClock;

    if (lastClock.equals("0") && clock.equals("1")) {
      this.onClockRise();
    }

    if (lastClock.equals("1") && clock.equals("0")) {
      this.onClockFall();
    }

    this.onResolve();

    // Save the last clock value.
    this.#lastClock = this.#clock.getValue();

    return this.getPropagationDelay();
  }

  abstract onClockRise(): void;
  abstract onClockFall(): void;
  abstract onResolve(): void;

  reset(): void {
    super.reset();

    this.#lastClock = null;
  }
}
