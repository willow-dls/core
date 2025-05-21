import { BitString } from "../BitString";
import { CircuitBus } from "../CircuitBus";
import { CircuitElement } from "../CircuitElement";
import { LogLevel } from "../CircuitLogger";

export class SimulationStopError extends Error {
  constructor() {
    super("Circuit simulation stopped by Stop element.");
    this.name = "SimulationStopError";
  }
}

export class Stop extends CircuitElement {
  constructor(inputs: CircuitBus[]) {
    super("StopElement", inputs, []);
  }

  resolve(): number {
    for (const input of this.getInputs()) {
      this.log(LogLevel.TRACE, `Input ${input.getId()}: ${input.getValue()}`);
      if (BitString.high().equals(input.getValue())) {
        this.log(
          LogLevel.TRACE,
          `Input is high; throwing SimulationStopError.`,
        );
        throw new SimulationStopError();
      }
    }

    return this.getPropagationDelay();
  }
}
