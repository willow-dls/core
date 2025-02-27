import { BitString } from "../BitString";
import { Gate } from "./Gate";

export class XorGate extends Gate {
  evaluate(previousValue: BitString, currentValue: BitString): BitString {
    return previousValue.and(currentValue.not()).or(previousValue.not().and(currentValue));
  }
}
