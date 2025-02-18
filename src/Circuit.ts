import { CircuitElement } from "./CircuitElement";
import { Input } from "./CircuitElement/Input";
import { Output } from "./CircuitElement/Output";

type QueueEntry = {
    time: number,
    element: CircuitElement
};

export type CircuitRunType = Record<string, number> | number[];
export type CircuitRunResult<T extends CircuitRunType> = {
    outputs: T,
    propagationDelay: number;
};

export class Circuit {
    #elements: CircuitElement[];

    #inputs: Record<string, Input>;
    #outputs: Record<string, Output>;

    #id: string;
    #name: string;

    constructor(id: string, name: string, elements: CircuitElement[]) {
        this.#elements = elements;

        this.#inputs = {};
        this.#outputs = {};

        this.#name = name;
        this.#id = id;

        elements.forEach(e => {
            if (e instanceof Input) {
                if (this.#inputs[e.getLabel()]) {
                    throw new Error(`Multiple inputs with the same label: '${e.getLabel()}'.`);
                }
                this.#inputs[e.getLabel()] = e;
            }

            if (e instanceof Output) {
                if (this.#outputs[e.getLabel()]) {
                    throw new Error(`Multiple outputs with the same label: '${e.getLabel()}'.`);
                }
                this.#outputs[e.getLabel()] = e;
            }
        });
    }

    getName(): string {
        return this.#name;
    }

    getId(): string {
        return this.#id;
    }

    run<T extends CircuitRunType>(inputs: T): CircuitRunResult<T> {
        console.log(`run(): Entered function with inputs: ${JSON.stringify(inputs)} `);
        const eventQueue: QueueEntry[] = [];

        // Set circuit inputs
        if (Array.isArray(inputs)) {
            Object.values(this.#inputs).forEach(input => {
                const value = inputs[input.getIndex()];
                input.setValue(value);
                eventQueue.push({
                    time: 0,
                    element: input
                });
            });
        } else {
            const inputLabels = Object.keys(inputs);
            for (const i in inputLabels) {
                const key = inputLabels[i];

                if (this.#inputs[key] === undefined) {
                    throw new Error(`Circuit does not have input with label '${key}'.`);
                }

                this.#inputs[key].setValue(inputs[key]);
                eventQueue.push({
                    time: 0,
                    element: this.#inputs[key]
                });
            }
        }

        console.log(`run(): Set all inputs.`);
        console.log(`run(): Initializing simulation...`);

        // Execute circuit simulation
        let steps = 0;
        let time = 0;

        let entry: QueueEntry | undefined = undefined;
        while (entry = eventQueue.shift()) {
            time = entry.time;
            console.log(`run(): [Step: ${steps}, Time: ${time}] ${JSON.stringify(entry)}`);

            const currentOutputs = entry.element.getOutputs().map(o => o.getValue());

            console.log(`run(): Resolving element: ${entry.element.constructor.name}`);
            const propDelay = entry.element.resolve();

            const propTo = entry.element
                .getOutputs()
                .filter((o, i) => o.getValue() != currentOutputs[i])
                .map(o => o.getElements())
                .flat();
            
            
            console.log(`run(): Current outputs: ${JSON.stringify(currentOutputs)}`);
            console.log(`run(): Resolved outputs: ${JSON.stringify(entry.element.getOutputs().map(o => o.getValue()))}`);
            console.log(`run(): Dependent Elements: ${JSON.stringify(propTo.map(e => e.constructor.name))}`);

            for (const el of propTo) {
                if (el == entry.element) {
                    continue;
                }

                eventQueue.push({
                    time: entry.time + propDelay,
                    element: el
                });
            }

            // Sort the event queue by time.
            eventQueue.sort((a, b) => a.time - b.time);
            console.log(`run(): Event queue: ${JSON.stringify(eventQueue.map(e => e.element.constructor.name))}`);

            steps++;

            if (steps > 1000000) {
                throw new Error('Simulation step limit exceeded; check for loops in circuit.');
            }



            // if (steps > 10) {
            //     console.log('run(): Exceeded max steps, breaking.');
            //     break;
            // }
        }

        // Return circuit outputs
        if (Array.isArray(inputs)) {
            return {
                // @ts-ignore
                outputs: Object.values(this.#outputs).map(o => o.getValue()),
                propagationDelay: time
            };
        } else {
            const outputs: Record<string, number> = {};

            for (const key of Object.keys(this.#outputs)) {
                outputs[key] = this.#outputs[key].getValue();
            }

            return {
                // @ts-ignore
                outputs: outputs,
                propagationDelay: time
            };
        }
    }
}