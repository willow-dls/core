import { Gate } from "./Gate";

export class AndGate extends Gate {
    evaluate(previousValue: number, currentValue: number): number {
        return previousValue && currentValue;
    }
}