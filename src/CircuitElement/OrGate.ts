import {Gate} from "./Gate";

export class OrGate extends Gate {
    evaluate(previousValue: number, currentValue: number): number {
        return previousValue || currentValue;
    }

}
