import { BitString } from "../BitString";
import { Gate } from "./Gate";

export class XnorGate extends Gate {
  // TODO: Fix this one
  evaluate(previousValue: BitString, currentValue: BitString): BitString {
    return previousValue.or(currentValue).not().or(previousValue.and(currentValue));
  }
}
