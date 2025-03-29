import { BitString } from "../BitString";
import { CircuitBus } from "../CircuitBus";
import { CircuitElement } from "../CircuitElement";

/**
 * The sequential element class is an abstract class which provides common
 * functionality for sequential elements which require a clock input and take
 * some action on the rising or falling edge of the clock. It is intended to
 * make it much easier to implement these sequential elements by abstracting
 * out the clock handling and knowing when to update values. It implements
 * {@link CircuitElement}'s `resolve()` method and provides new abstract
 * methods for more specific timing of sequential actions.
 */
export abstract class SequentialElement extends CircuitElement {
  #clock: CircuitBus;
  #lastClock: BitString | null;

  /**
   * Construct a new sequential element.
   * @param subsystem The logging subsystem of the sequential element.
   * @param clock The clock input bus.
   * @param inputs The other element input buses.
   * @param outputs The element's output buses.
   */
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

  /**
   * This function is executed on the rising edge of the clock,
   * when the clock goes from low to high. This may not be every time
   * {@link resolve} is called, ensuring that actions placed in this
   * function only happen when the clock rises, not while it is stable
   * or when it falls.
   */
  abstract onClockRise(): void;

  /**
   * This function is executed on the falling edge of the clock,
   * when the clock goes from high to low. This may not be every time
   * {@link resolve} is called, ensuring that actions placed in this
   * function only happen when the clock falls, not while it is stable
   * or when it rises.
   */
  abstract onClockFall(): void;

  /**
   * This function is executed every time {@link resolve} is called,
   * _after_ {@link onClockRise} and/or {@link onClockFall}, if either are
   * called. Note that it need not return the propagation delay, because this
   * is handled automatically by this class.
   */
  abstract onResolve(): void;

  reset(): void {
    super.reset();

    this.#lastClock = null;
  }
}
