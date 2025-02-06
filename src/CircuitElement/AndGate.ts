import { Gate } from "./Gate";

export class AndGate extends Gate {
    initialValue(): number {
        return 1;
    }
    
    evaluate(previousValue: number, currentValue: number): number {
        return previousValue && currentValue;
    }
}