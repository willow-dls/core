import {Gate} from "./Gate";

export class OrGate extends Gate {

    initialValue(): number {
        return 0;
    }

    evaluate(previousValue: number, currentValue: number): number {
        return previousValue || currentValue;
    }

}
