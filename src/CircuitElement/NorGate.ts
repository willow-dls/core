import { BitString } from "../BitString";
import { LogLevel } from "../CircuitLogger";
import { Gate } from "./Gate";

export class NorGate extends Gate {
    evaluate(previousValue: BitString, currentValue: BitString): BitString {
        const result = previousValue.or(currentValue).not();
        this.log(LogLevel.TRACE, `${previousValue} NOR ${currentValue} => ${result}`);
        return result;
    }
}