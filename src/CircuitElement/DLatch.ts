import { CircuitBus } from "../CircuitBus";
import { SequentialElement } from "./SequentialElement";

/**
 * Represents a D-Latch circuit element, a type of sequential logic circuit.
 * The D-Latch captures the value of the data input (`d`) on the rising edge of the clock signal
 * and outputs it to `q` and its complement to `qInv`.
 */
export class DLatch extends SequentialElement {
  /**
   * Constructs a new DLatch instance.
   *
   * @param clock The clock signal input bus.
   * @param d The data input bus.
   * @param q The output bus for the stored value.
   * @param qInv The output bus for the complement of the stored value.
   */
  constructor(
    clock: CircuitBus,
    d: CircuitBus,
    q: CircuitBus,
    qInv: CircuitBus,
  ) {
    super("DLatchElement", clock, [d], [q, qInv]);
  }

  onClockRise(): void {
    const [clock, d] = this.getInputs();
    const [q, qInv] = this.getOutputs();

    q.setValue(d.getValue()?.not() ?? null);
    qInv.setValue(d.getValue()?.not() ?? null);
  }

  onResolve(): void {}

  onClockFall(): void {}
}
