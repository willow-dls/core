import { BitString } from "../BitString";
import { LogLevel } from "../CircuitLogger";
import { Gate } from "./Gate";

/**
 * A simple XOR gate.
 *
 * @see OrGate
 */
export class XorGate extends Gate {
  evaluate(previousValue: BitString, currentValue: BitString): BitString {
    const result = previousValue
      .and(currentValue.not())
      .or(previousValue.not().and(currentValue));
    this.log(
      LogLevel.TRACE,
      `${previousValue} XOR ${currentValue} => ${result}`,
    );
    return result;
  }
}
