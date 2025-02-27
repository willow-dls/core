import { BitString } from "../BitString";
import { LogLevel } from "../CircuitLogger";
import {Gate} from "./Gate";

export class NandGate extends Gate {
    evaluate(previousValue: BitString, currentValue: BitString): BitString {
        const result = previousValue.and(currentValue).not();
        this.log(LogLevel.TRACE, `${previousValue} NAND ${currentValue} => ${result}`);
        return result;
    }
}
