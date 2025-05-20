import { BitString } from "../BitString.js";
import { CircuitBus } from "../CircuitBus.js";
import { SequentialElement } from "./SequentialElement.js";

export class JLSRegister extends SequentialElement {
  #type: "nff" | "pff";

  constructor(
    clock: CircuitBus,
    d: CircuitBus,
    q: CircuitBus,
    qInv: CircuitBus,
    type: "nff" | "pff",
  ) {
    super("JLSRegisterElement", clock, [d], [q, qInv]);
    this.#type = type;
  }

  #setOutput() {
    const [clock, d] = this.getInputs();
    const [q, qInv] = this.getOutputs();

    q.setValue(d.getValue());
    qInv.setValue(q.getValue()?.not() ?? null);
  }

  onClockRise(): void {
    if (this.#type == "pff") {
      this.#setOutput();
    }
  }

  onClockFall(): void {
    if (this.#type == "nff") {
      this.#setOutput();
    }
  }

  onResolve(): void {}

  initialize(value: BitString): void {
    const [q, qInv] = this.getOutputs();

    q.setValue(value);
    qInv.setValue(value.not());
  }
}
