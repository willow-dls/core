import { Gate } from "./Gate";

export class NotGate extends Gate {
  evaluate(previousValue: number, currentValue: number): number {
    console.log(`NotGate: ${previousValue} NOT ${currentValue} => ${Number(!currentValue)}`)
    return Number(!currentValue);
  }
}
