import { BitString } from "../BitString";
import { LogLevel } from "../CircuitLogger";
import { Gate } from "./Gate";

export class NotGate extends Gate {
  evaluate(previousValue: BitString, currentValue: BitString): BitString {
    const result = currentValue.not();
    this.log(LogLevel.TRACE, `NOT ${currentValue} => ${result}`);
    return result;
  }
}
