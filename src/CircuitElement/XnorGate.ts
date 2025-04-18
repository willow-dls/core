import { BitString } from "../BitString";
import { LogLevel } from "../CircuitLogger";
import { Gate } from "./Gate";

/**
 * A simple XNOR gate.
 *
 * @see XorGate
 * @see NotGate
 */
export class XnorGate extends Gate {
  // TODO: Fix this one
  evaluate(previousValue: BitString, currentValue: BitString): BitString {
    const result = previousValue
      .or(currentValue)
      .not()
      .or(previousValue.and(currentValue));
    this.log(
      LogLevel.TRACE,
      `${previousValue} XNOR ${currentValue} => ${result}`,
    );
    return result;
  }
}
