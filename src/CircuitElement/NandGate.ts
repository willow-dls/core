import {Gate} from "./Gate";

export class NandGate extends Gate {

    initialValue(): number {
        return 0;
    }

    evaluate(previousValue: number, currentValue: number): number {
        return Number(!(previousValue && currentValue));
    }
}
