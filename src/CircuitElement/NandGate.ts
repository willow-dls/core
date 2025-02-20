import {Gate} from "./Gate";

export class NandGate extends Gate {
    evaluate(previousValue: number, currentValue: number): number {
        return Number(!(previousValue && currentValue));
    }
}
