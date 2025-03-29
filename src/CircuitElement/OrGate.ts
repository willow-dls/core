import { BitString } from "../BitString";
import { LogLevel } from "../CircuitLogger";
import { Gate } from "./Gate";

/**
 * A simple OR gate.
 */
export class OrGate extends Gate {
  evaluate(previousValue: BitString, currentValue: BitString): BitString {
    const result = previousValue.or(currentValue);
    this.log(
      LogLevel.TRACE,
      `${previousValue} OR ${currentValue} => ${result}`,
    );
    return result;
  }
}
