import { BitString } from "../BitString";
import { LogLevel } from "../CircuitLogger";
import { Gate } from "./Gate";

export class BufferGate extends Gate {
  evaluate(previousValue: BitString, currentValue: BitString): BitString {
    this.log(LogLevel.TRACE, `BUFFER ${currentValue} => ${currentValue}`);
    return currentValue;
  }
}
