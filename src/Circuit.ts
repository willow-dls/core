import { BitString } from "./BitString";
import { CircuitElement } from "./CircuitElement";
import { Input } from "./CircuitElement/Input";
import { Output } from "./CircuitElement/Output";
import { CircuitLoggable, LogLevel } from "./CircuitLogger";

type QueueEntry = {
    time: number,
    element: CircuitElement
};

export type CircuitRunType = Record<string, BitString | string> | (BitString | string)[];
export type CircuitRunResult<T extends CircuitRunType> = {
    outputs: T,
    propagationDelay: number;
    steps: number;
};

export class Circuit extends CircuitLoggable {
    #inputs: Record<string, Input>;
    #outputs: Record<string, Output>;
    #elements: CircuitElement[];

    #id: string;
    #name: string;

    constructor(id: string, name: string, elements: CircuitElement[]) {
        super('Circuit');

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

        this.#elements = elements;
    }

    getName(): string {
        return this.#name;
    }

    getId(): number {
        // TODO: We should intake an integer instead of parsing the
        // string ID here, particularly because this method could potentially
        // get called a lot.
        return parseInt(this.#id);
    }

    #log(level: LogLevel, msg: string, data?: any) {
        super.log(level, `[id: '${this.getId()}', name: '${this.getName()}']: ${msg}`, data);
    }

    run<T extends CircuitRunType>(inputs: T, haltCond?: (inputs: Record<string, Input>, outputs: Record<string, Output>) => boolean): CircuitRunResult<T> {
        this.#log(LogLevel.INFO, 'Beginning simulation with inputs:', { inputs: inputs });
        const eventQueue: QueueEntry[] = [];

        this.#log(LogLevel.TRACE, 'Resetting all elements...');
        this.#elements.forEach(e => e.reset());

        this.#log(LogLevel.DEBUG, 'Setting inputs...');
        if (Array.isArray(inputs)) {
            this.#log(LogLevel.TRACE, 'Input was provided as array; setting inputs by index.');
            Object.values(this.#inputs).forEach(input => {
                let value = inputs[input.getIndex()];

                if (typeof value === 'string') {
                    value = new BitString(value);
                }

                input.setValue(value);
            });
        } else {
            this.#log(LogLevel.TRACE, 'Input was provided as an object; setting inputs by key.');
            const inputLabels = Object.keys(inputs);
            for (const i in inputLabels) {
                let didSetLabel = false;

                const key = inputLabels[i];
                let value = inputs[key];

                if (typeof value === 'string') {
                    value = new BitString(value);
                }

                if (this.#inputs[key]) {
                    this.#inputs[key].setValue(value);

                    didSetLabel = true;
                    this.#log(LogLevel.TRACE, `Set input: ${key}`);

                }

                if (this.#outputs[key]) {
                    this.#outputs[key].setValue(value);

                    didSetLabel = true;
                    this.#log(LogLevel.TRACE, `Set output: ${key}`);
                }

                if (!didSetLabel) {
                    throw new Error(`No inputs or outputs with the given label: ${key}`);
                }
            }
        }

        this.#log(LogLevel.TRACE, `Adding elements to event queue...`);
        // Simply push all of the elements into the queue. This will cause non-interactive
        // elements such as constant values and power/ground to propagate their outputs.
        // Other than a little more initial compute, this should have no side effects.
        this.#elements.forEach(e => {
            eventQueue.push({
                time: 0,
                element: e
            });
        });

        this.#log(LogLevel.TRACE, `Starting simulation event loop...`);
        let steps = 0;
        let time = 0;

        let entry: QueueEntry | undefined = undefined;
        while (entry = eventQueue.shift()) {
            time = entry.time;
            this.#log(LogLevel.DEBUG, `[Step: ${steps + 1}, Time: ${time}] Resolving element: ${entry.element.constructor.name}[id=${entry.element.getId()}]`);

            const currentOutputs = entry.element.getOutputs().map(o => o.getValue());
            const propDelay = entry.element.resolve();

            this.#log(LogLevel.TRACE, `Propagation delay: ${propDelay}`);
            this.#log(LogLevel.DEBUG, `Outputs:`, {
                current: currentOutputs,
                resolved: entry.element.getOutputs().map(o => o.getValue())
            });

            const propTo = entry.element
                .getOutputs()
                .filter((o, i) => entry?.element instanceof Input || !o.getValue().equals(currentOutputs[i]))
                .map(o => o.getElements())
                .flat();

            for (const el of propTo) {
                if (el == entry.element) {
                    continue;
                }

                this.#log(LogLevel.TRACE, `Propagating to element: ${el.constructor.name}[id=${el.getId()}]`);
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
            }

            eventQueue.sort((a, b) => a.time - b.time);
            steps++;
            this.#log(LogLevel.TRACE, `Event Queue:`, eventQueue.map(e => `${e.element.constructor.name}[id=${e.element.getId()}]`));


            if (steps > 1000000) {
                throw new Error('Simulation step limit exceeded; check for loops in circuit.');
            }
        }

        this.#log(LogLevel.TRACE, "Simulation completed. Collecting outputs...");
        let output;

        // Return circuit outputs
        // Regardless of whether the user submitted a string or a BitString
        // for the inputs, BitStrings will be returned as they preserve information
        // such as the bus width of the output.
        if (Array.isArray(inputs)) {
            this.#log(LogLevel.TRACE, 'Building output as array.');
            output = {
                outputs: Object.values(this.#outputs).map(o => o.getValue()),
                propagationDelay: time,
                steps: steps
            };
        } else {
            this.#log(LogLevel.TRACE, 'Building output as object.');
            const outputs: Record<string, BitString> = {};

            for (const key of Object.keys(this.#outputs)) {
                outputs[key] = this.#outputs[key].getValue();
            }

            output = {
                outputs: outputs,
                propagationDelay: time,
                steps: steps
            };
        }

        this.#log(LogLevel.INFO, `Ending simulation with outputs:`, output);

        // @ts-ignore
        return output;
    }
}