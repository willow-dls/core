import { Gate } from "./Gate";

export class XnorGate extends Gate {
  initialValue(): number {
    return 0;
  }

  // TODO: Fix this one
  evaluate(previousValue: number, currentValue: number): number {
    return Number(
      !(previousValue || currentValue) || (previousValue && currentValue),
    );
  }
}
