import { BitString } from "../BitString";
import { Gate } from "./Gate";

export class NorGate extends Gate {
    evaluate(previousValue: BitString, currentValue: BitString): BitString {
        return previousValue.or(currentValue).not();
    }
}