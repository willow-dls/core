import { BitString } from "../BitString";
import { CircuitBus } from "../CircuitBus";
import { SequentialElement } from "./SequentialElement";

export class DFlipFlop extends SequentialElement {
  constructor(
    clock: CircuitBus,
    d: CircuitBus,
    q: CircuitBus,
    qInv: CircuitBus,
    reset: CircuitBus,
    preset: CircuitBus,
    enable: CircuitBus,
  ) {
    super("DFlipFlopElement", clock, [d, reset, preset, enable], [q, qInv]);
  }

  onClockRise(): void {
    const [clock, d, reset, preset, enable] = this.getInputs();
    const [q, qInv] = this.getOutputs();

    if (enable.getValue()?.equals(BitString.high())) {
      // onResolve() will update qInv  for us.
      q.setValue(d.getValue());
    }
  }

  onResolve(): void {
    const [clock, d, reset, preset, enable] = this.getInputs();
    const [q, qInv] = this.getOutputs();

    if (reset.getValue()?.equals(BitString.high())) {
      q.setValue(preset.getValue());
    }

    qInv.setValue(q.getValue()?.not() ?? null);
  }

  onClockFall(): void {}
}
