import { BitString } from "../BitString";
import { LogLevel } from "../CircuitLogger";
import { Gate } from "./Gate";

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
