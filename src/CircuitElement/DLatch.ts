import { CircuitBus } from "../CircuitBus";
import { SequentialElement } from "./SequentialElement";

export class DLatch extends SequentialElement {
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
