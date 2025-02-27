import { BitString } from "../BitString";
import { Gate } from "./Gate";

export class NotGate extends Gate {
  evaluate(previousValue: BitString, currentValue: BitString): BitString {
    return currentValue.not();
  }
}
