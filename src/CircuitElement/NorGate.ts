import { Gate } from "./Gate";

export class NorGate extends Gate {
    evaluate(previousValue: number, currentValue: number): number {
        return !(previousValue || currentValue) ? 1 : 0;
    }
}