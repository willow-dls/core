import { Gate } from "./Gate";

export class NotGate extends Gate {
  evaluate(previousValue: number, currentValue: number): number {
    return Number(!currentValue);
  }
}
