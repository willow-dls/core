import { Gate } from "./Gate";

export class NotGate extends Gate {
  initialValue(): number {
    return 0;
  }

  evaluate(previousValue: number, currentValue: number): number {
    return Number(!currentValue);
  }
}
