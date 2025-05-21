import { BitString } from "../BitString";
import { CircuitBus } from "../CircuitBus";
import { LogLevel } from "../CircuitLogger";
import { SequentialElement } from "./SequentialElement";

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
    this.log(LogLevel.TRACE, `Set output: ${q.getValue()}`);
  }

  onClockRise(): void {
    if (this.#type == "pff") {
      this.log(LogLevel.TRACE, `Register mode: positive triggered.`);
      this.#setOutput();
    }
  }

  onClockFall(): void {
    if (this.#type == "nff") {
      this.log(LogLevel.TRACE, `Register mode: negative triggered.`);
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
