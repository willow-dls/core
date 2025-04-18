import { BitString } from "../BitString";
import { LogLevel } from "../CircuitLogger";
import { Gate } from "./Gate";

/**
 * A buffer element simply passes through its input with a propagation delay.
 */
export class BufferGate extends Gate {
  evaluate(previousValue: BitString, currentValue: BitString): BitString {
    this.log(LogLevel.TRACE, `BUFFER ${currentValue} => ${currentValue}`);
    return currentValue;
  }
}
