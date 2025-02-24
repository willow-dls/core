import { BitString } from "../BitString";
import { Gate } from "./Gate";

export class AndGate extends Gate {
    evaluate(previousValue: BitString, currentValue: BitString): BitString {
        return previousValue.and(currentValue);
    }
}