import { BitString } from "./BitString";
import { CircuitElement } from "./CircuitElement";
import { Input } from "./CircuitElement/Input";
import { Output } from "./CircuitElement/Output";
import { CircuitLoggable, LogLevel } from "./CircuitLogger";

type QueueEntry = {
    time: number,
    element: CircuitElement
};

export type CircuitRunType = Record<string, BitString> | BitString[];
export type CircuitRunResult<T extends CircuitRunType> = {
    outputs: T,
    propagationDelay: number;
};

export class Circuit extends CircuitLoggable {
    #elements: CircuitElement[];

    #inputs: Record<string, Input>;
    #outputs: Record<string, Output>;

    #id: string;
    #name: string;

    constructor(id: string, name: string, elements: CircuitElement[]) {
        super('Circuit');

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

            this.propagateLoggersTo(e);
        });
    }

    getName(): string {
        return this.#name;
    }

    getId(): string {
        return this.#id;
    }

    #log(level: LogLevel, msg: string, data?:  any) {
       super.log(level, `[id: '${this.getId()}', name: '${this.getName()}']: ${msg}`, data);
    }

    run<T extends CircuitRunType>(inputs: T, haltCond?: (inputs: Record<string, Input>, outputs: Record<string, Output>) => boolean): CircuitRunResult<T> {
        this.#log(LogLevel.INFO, 'Beginning simulation with inputs:', { inputs: inputs});
        const eventQueue: QueueEntry[] = [];

        this.#log(LogLevel.DEBUG, 'Setting inputs...');
        if (Array.isArray(inputs)) {
            this.#log(LogLevel.TRACE, 'Input was provided as array; setting inputs by index.');
            Object.values(this.#inputs).forEach(input => {
                const value = inputs[input.getIndex()];
                input.setValue(value);
                eventQueue.push({
                    time: 0,
                    element: input
                });
            });
        } else {
            this.#log(LogLevel.TRACE, 'Input was provided as an object; setting inputs by key.');
            const inputLabels = Object.keys(inputs);
            for (const i in inputLabels) {
                let didSetLabel = false;

                const key = inputLabels[i];

                if (this.#inputs[key]) {
                    this.#inputs[key].setValue(inputs[key]);
                    eventQueue.push({
                        time: 0,
                        element: this.#inputs[key]
                    });

                    didSetLabel = true;
                    this.#log(LogLevel.TRACE, `Set input: ${key}`);

                }

                if (this.#outputs[key]) {
                    this.#outputs[key].setValue(inputs[key]);
                    eventQueue.push({
                        time: 0,
                        element: this.#outputs[key]
                    });

                    didSetLabel = true;
                    this.#log(LogLevel.TRACE, `Set output: ${key}`);
                }

                if (!didSetLabel) {
                    throw new Error(`No inputs or outputs with the given label: ${key}`);
                }
            }
        }

        this.#log(LogLevel.TRACE, `Starting simulation event loop...`);
        let steps = 0;
        let time = 0;

        let entry: QueueEntry | undefined = undefined;
        while (entry = eventQueue.shift()) {
            time = entry.time;
            this.#log(LogLevel.DEBUG, `[Step: ${steps + 1}, Time: ${time}] Resolving element: ${entry.element.constructor.name}`);

            const currentOutputs = entry.element.getOutputs().map(o => o.getValue());
            const propDelay = entry.element.resolve();
            const propTo = entry.element
                .getOutputs()
                .filter((o, i) => entry?.element instanceof Input || !o.getValue().equals(currentOutputs[i]))
                .map(o => o.getElements())
                .flat();

            this.#log(LogLevel.TRACE, `Propagation delay: ${propDelay}`);
            this.#log(LogLevel.DEBUG, `Outputs:`, {
                current: currentOutputs,
                resolved: entry.element.getOutputs().map(o => o.getValue())
            });

            for (const el of propTo) {
                if (el == entry.element) {
                    continue;
                }

                this.#log(LogLevel.TRACE, `Propagating to element: ${el.constructor.name}`);
                eventQueue.push({
                    time: entry.time + propDelay,
                    element: el
                });
            }

            // If the halt condition is satisfied in this step of the simulation,
            // break out of the event loop early, even if there are more inputs to
            // process.
            //
            // Note that a premature halt of the simulation which is earlier than expected
            // is a bug in the circuit, not the simulation.
            if (haltCond && haltCond(this.#inputs, this.#outputs)) {
                this.#log(LogLevel.DEBUG, `Halt condition satisfied; breaking simulation loop.`);
                break;
            } else {
                this.#log(LogLevel.TRACE, `No halt condition, or halt condition not satisfied.`);
            }

            this.#log(LogLevel.TRACE, `Sorting event queue...`);
            eventQueue.sort((a, b) => a.time - b.time);
            steps++;

            if (steps > 1000000) {
                throw new Error('Simulation step limit exceeded; check for loops in circuit.');
            }
        }

        this.#log(LogLevel.TRACE, "Simulation completed. Collecting outputs...");
        let output;

        // Return circuit outputs
        if (Array.isArray(inputs)) {
            this.#log(LogLevel.TRACE, 'Building output as array.');
            output = {
                outputs: Object.values(this.#outputs).map(o => o.getValue()),
                propagationDelay: time
            };
        } else {
            this.#log(LogLevel.TRACE, 'Building output as object.');
            const outputs: Record<string, BitString> = {};

            for (const key of Object.keys(this.#outputs)) {
                outputs[key] = this.#outputs[key].getValue();
            }

            output = {
                outputs: outputs,
                propagationDelay: time
            };
        }

        this.#log(LogLevel.INFO, `Ending simulation with outputs:`, output);

        // @ts-ignore
        return output;
    }
}