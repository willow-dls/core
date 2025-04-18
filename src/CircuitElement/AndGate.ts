import { BitString } from "../BitString";
import { LogLevel } from "../CircuitLogger";
import { Gate } from "./Gate";

/**
 * A simple AND gate.
 */
export class AndGate extends Gate {
  evaluate(previousValue: BitString, currentValue: BitString): BitString {
    const result = previousValue.and(currentValue);
    this.log(
      LogLevel.TRACE,
      `${previousValue} AND ${currentValue} => ${result}`,
    );
    return result;
  }
}
