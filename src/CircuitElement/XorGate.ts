import { Gate } from "./Gate";

export class XorGate extends Gate {
  evaluate(previousValue: number, currentValue: number): number {
    return Number(
      (previousValue && !currentValue) || (!previousValue && currentValue),
    );
  }
}
