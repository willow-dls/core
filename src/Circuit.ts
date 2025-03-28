import { BitString } from "./BitString";
import { CircuitElement } from "./CircuitElement";
import { Clock } from "./CircuitElement/Clock";
import { Input } from "./CircuitElement/Input";
import { Output } from "./CircuitElement/Output";
import { SubCircuit } from "./CircuitElement/SubCircuit";
import { CircuitLoggable, LogLevel } from "./CircuitLogger";

type QueueEntry = {
  time: number;
  element: CircuitElement;
};

export type CircuitRunType =
  | Record<string, BitString | string>
  | (BitString | string | null)[];

export type CircuitRunResult<T extends CircuitRunType> = {
  outputs: T;
  propagationDelay: number;
  steps: number;
};

/**
 * The Circuit is how you execute the simulation. It provides everything you
 * need to evaluate a complete circuit (which may or may not consist of {@link SubCircuit}s)
 * with or without a clock.
 * 
 * If a circuit has no clock, then it is simply evaluated like a combinatorial
 * or sequential circuit. However, if it does have a clock, then the engine will
 * tick the clock automatically, evaluating the circuit each clock cycle.
 * 
 * It is highly unlikely that you will instantiate this class directly; rather, you
 * should normally retrieve circuits from your {@link CircuitProject}, provided to
 * you by a {@link CircuitLoader} (see {@link loadProject}).
 * 
 * > [!NOTE] This simulation engine is not thread-safe. While this shouldn't be
 * > a concern for most JavaScript environments, it is important to remember that
 * > this class contains a lot of internal state which is not intended to be mutated
 * > by different operating system threads at the same time.
 * >
 * > You absolutely cannot call {@link run} or {@link resolve} from two different
 * > threads, or modify the circuit while it is running in another thread. This will
 * > result in unintended consequences and undefined behavior.
 */
export class Circuit extends CircuitLoggable {
  #inputs: Record<string, Input>;
  #outputs: Record<string, Output>;
  #elements: CircuitElement[];
  #clocks: Clock[];

  #id: string;
  #name: string;

  /**
   * Construct a new circuit.
   * @param id The string ID of the circuit. This will typically come from the data
   * file from which the circuit was loaded.
   * @param name The name of the circuit. This will typically come from the data file
   * from which the circuit was loaded.
   * @param elements All of the circuit elements which make up this circuit. The order
   * does not matter and does not affect execution of this circuit in any way. The
   * constructor will index elements by their type for efficient access and execution
   * as necessary.
   */
  constructor(id: string, name: string, elements: CircuitElement[]) {
    super("Circuit");

    this.#inputs = {};
    this.#outputs = {};

    this.#name = name;
    this.#id = id;

    this.#clocks = [];

    elements.forEach((e) => {
      if (e instanceof Input) {
        if (this.#inputs[e.getLabel()]) {
          throw new Error(
            `Multiple inputs with the same label: '${e.getLabel()}'.`,
          );
        }
        this.#inputs[e.getLabel()] = e;
      }

      if (e instanceof Output) {
        if (this.#outputs[e.getLabel()]) {
          throw new Error(
            `Multiple outputs with the same label: '${e.getLabel()}'.`,
          );
        }
        this.#outputs[e.getLabel()] = e;
      }

      if (e instanceof Clock && !this.#clocks.includes(e)) {
        this.#clocks.push(e);
      }

      // Recursively get all clock elements. Subcircuits should in theory
      // simply take a clock bus as an input; there should be no reason to
      // have a clock in a subcircuit. Nonetheless, it is *technically*
      // allowed so we must ensure subcircuit clocks are also ticked with this
      // circuit's clock.
      if (e instanceof SubCircuit)
        [
          e.getClocks().forEach((c) => {
            if (!this.#clocks.includes(c)) {
              this.#clocks.push(c);
            }
          }),
        ];

      this.propagateLoggersTo(e);
    });

    this.#elements = elements;
  }

  /**
   * Get the name of this circuit.
   * @returns The name of this circuit which was passed into the constructor.
   */
  getName(): string {
    return this.#name;
  }

  /**
   * Get the ID of this circuit.
   * @returns The ID of this circuit, not from the {@link CircuitLoggable} class,
   * but from the constructor.
   */
  getId(): string {
    return this.#id;
  }

  /**
   * Get all of the clocks in this circuit.
   * @returns An array of all the clocks in this circuit, recursively including the clocks
   * from subcircuits as well (though subcircuits really ought to not have clocks in them,
   *  they should take the clock as an input.)
   */
  getClocks(): Clock[] {
    return this.#clocks;
  }

  #log(level: LogLevel, msg: string, data?: any) {
    super.log(
      level,
      `[id: '${this.getId()}', name: '${this.getName()}']: ${msg}`,
      data,
    );
  }

  /**
   * Execute this circuit with the provided inputs. This method runs an event-driven simulation
   * which evaluates the circuit in terms of its elements, propagating the outputs of elements to
   * other elements which are connected.
   * 
   * If a circuit has no clock, then it is simply evaluated like a combinatorial
   * or sequential circuit. However, if it does have a clock, then the engine will
   * tick the clock automatically, evaluating the circuit each clock cycle.
   * 
   * > [!NOTE] This simulation engine inherits some limitations of CircuitVerse when evaluating
   * > circuits with clocks:
   * > - Real life circuits go into a stable state between clock ticks. Irrespective of any
   * > implemented circuit element delays, the circuits go into a stable state between clock
   * > ticks. The simulator thus cannot simulate circuits that do not go into a stable
   * > state between clock ticks.
   * > - Similarly, circuits go into a stable state before processing input signals from
   * > different input elements.
   * >
   * > These limitations are due to the event-driven architecture of the engine, which this
   * > engine originally took inspiration from CircuitVerse. Note, of course, that this
   * > engine **does not share any code** with CircuitVerse, it simply used the same algorithm
   * > and general principles.
   * 
   * > [!WARNING] It is possible for this function to run forever. If you are attempting to
   * > run a circuit with clock inputs, but don't provide the optional `haltCond`, the simulation
   * > will simply keep ticking the clock indefinitely, and will thus never return, even if the
   * > circuit has stabilized. 
   * >
   * > If your circuit contains a clock (which you can check by checking that {@link getClocks} returns
   * > an array with size `> 0`), you must provide a `haltCond` that will terminate the simulation
   * > either after a bus contains a certain value, or after the desired number of clock cycles have
   * > passed.
   * >
   * > If any {@link CircuitLogger}s are attached to this circuit, a warning will be emitted to
   * > them if this method detects that the simulation will run forever.
   * 
   * @param inputs A keyed object of input values or an array of input values. For end users, the
   * keyed object will provide the most intuitive interface; the array syntax exists to support
   * CircuitVerse {@link SubCircuit}s, which don't have labeled inputs, but rather take their inputs
   * by index. See the documentation for {@link CircuitRunType} and {@link CircuitRunResult} for
   * more information on this parameter.
   * @param haltCond A callback function which is executed each clock cycle and accepts a boolean
   * representing whether the clock is currently high or low, the clock cycle number, and the current
   * state of the circuits outputs. This function returns a boolean value indicating whether or not
   * the simulation should be halted: a value of `true` indicates that the simulation should be
   * halted, and a value of `false` indicates that it should continue on to the next clock cycle.
   * @param clockFrequency An optional number which specifies the clock "frequency". The simulation
   * speed is not changed (the simulation always executes as fast as possible), but if this parameter
   * is provided, the simulator will emit a warning if a circuit takes longer than this amount of
   * time to propagate its value. If you see this warning, the output values of the circuit probably
   * cannot be trusted because of the limitations stated above.
   * @returns An object which contains the results of simulating this circuit, including the total
   * propagation delay, the number of simulation steps required, and the output values.
   */
  run<T extends CircuitRunType>(
    inputs: T,
    haltCond?: (
      clockHigh: boolean,
      clockCycles: number,
      output: CircuitRunResult<T>,
    ) => boolean,
    clockFrequency: number = 500,
  ): CircuitRunResult<T> {
    this.#log(LogLevel.INFO, `Beginning simulation with inputs:`, inputs);

    // There are no clocks; just tick once and return the results.
    if (!this.#clocks.length) {
      this.#log(
        LogLevel.DEBUG,
        "No clock elements in this circuit; simply resolving.",
      );
      return this.resolve(inputs);
    }

    if (!haltCond) {
      this.#log(
        LogLevel.WARN,
        "Clock elements present but no halt condition provided; this simulation will run forever.",
      );
    }

    let init: boolean = true;
    let result: CircuitRunResult<T>;

    let clockHigh: boolean = false;
    let clockCycles: number = 0;

    do {
      this.#clocks.forEach((c) => c.tick());
      this.#log(
        LogLevel.INFO,
        `[cycle = ${clockCycles}, high = ${clockHigh}] Resolving circuit for this cycle.`,
      );

      result = this.resolve(init ? inputs : undefined);

      this.#log(
        LogLevel.INFO,
        `[cycle = ${clockCycles}, high = ${clockHigh}] Propagation delay: ${result.propagationDelay}`,
        result.outputs,
      );

      if (clockFrequency && result.propagationDelay > clockFrequency / 2) {
        this.#log(
          LogLevel.WARN,
          `Circuit propogation delay longer than clock frequency: results cannot be trusted.`,
        );
      }

      clockHigh = BitString.high().equals(
        this.#clocks[0].getOutputs()[0].getValue(),
      );
      init = false;

      if (!clockHigh) {
        clockCycles++;
      }
    } while (!(haltCond && haltCond(clockHigh, clockCycles, result)));

    this.#log(
      LogLevel.INFO,
      `Halt condition satisfied after ${clockCycles} cycles. Clock ended ${clockHigh ? "high" : "low"}.`,
    );

    this.#log(
      LogLevel.INFO,
      `Completed simulation with outputs:`,
      result.outputs,
    );

    return result;
  }

  /**
   * Resolve this circuit as though it was a {@link CircuitElement} even though it isn't.
   * This method is used to implement {@link SubCircuit}s and is called internally by {@link run},
   * and should not be used in any other scenarios. Use {@link run} instead.
   * 
   * This method is responsible for executing a single clock cycle of the circuit. It
   * contains the event loop, taking in the
   * inputs, queuing them up, and then running the event loop until the values have propagated
   * entirely through the circuit and there are no more events in the queue.
   * 
   * @param inputs The optional inputs to the circuit. If inputs are provided, each element
   * in the circuit is reset by calling {@link CircuitElement.reset} and the simulation
   * effectively starts over. If no inputs are provided here, then the simulation runs from the
   * previous state it was in when it ended the last time it ran. This functionality is extremely
   * useful for a clocked circuit, where the clock input changes and requires the circuit to be
   * re-evaluated each cycle.
   * @returns 
   */
  resolve<T extends CircuitRunType>(inputs?: T): CircuitRunResult<T> {
    this.#log(LogLevel.INFO, "Resolving circuit...");
    const eventQueue: QueueEntry[] = [];

    if (inputs) {
      this.#log(LogLevel.INFO, `Circuit received inputs:`, { inputs: inputs });

      this.#log(LogLevel.TRACE, "Resetting all elements...");
      this.#elements.forEach((e) => e.reset());

      this.#log(LogLevel.DEBUG, "Propagating inputs...");
      if (Array.isArray(inputs)) {
        this.#log(
          LogLevel.TRACE,
          "Input was provided as array; setting inputs by index.",
        );
        Object.values(this.#inputs).forEach((input) => {
          let value = inputs[input.getIndex()];

          if (typeof value === "string") {
            value = new BitString(value);
          }

          if (value) {
            input.setValue(value);
          }
        });
      } else {
        this.#log(
          LogLevel.TRACE,
          "Input was provided as an object; setting inputs by key.",
        );
        const inputLabels = Object.keys(inputs);
        for (const i in inputLabels) {
          let didSetLabel = false;

          const key = inputLabels[i];
          let value = inputs[key];

          if (typeof value === "string") {
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

            eventQueue.push({
              time: 0,
              element: this.#outputs[key],
            });
          }

          if (!didSetLabel) {
            throw new Error(
              `No inputs or outputs with the given label: ${key}`,
            );
          }
        }
      }
    } else {
      this.#log(
        LogLevel.TRACE,
        "No inputs provided; preserving previous state.",
      );
    }

    this.#log(LogLevel.TRACE, `Adding elements to event queue...`);
    // Simply push all of the elements into the queue. This will cause non-interactive
    // elements such as constant values and power/ground to propagate their outputs.
    // Other than a little more initial compute, this should have no side effects.
    this.#elements.forEach((e) => {
      if (!(e instanceof Output)) {
        eventQueue.push({
          time: 0,
          element: e,
        });
      }
    });

    this.#log(LogLevel.TRACE, `Starting event loop...`);
    let steps = 0;
    let time = 0;

    let entry: QueueEntry | undefined = undefined;
    while ((entry = eventQueue.shift())) {
      time = entry.time;
      this.#log(
        LogLevel.DEBUG,
        `[Step: ${steps + 1}, Time: ${time}] Resolving element: ${entry.element}`,
      );

      const currentOutputs = entry.element
        .getOutputs()
        .map((o) => o.getValue());
      const propDelay = entry.element.resolve();

      this.#log(LogLevel.TRACE, `Propagation delay: ${propDelay}`);
      this.#log(LogLevel.DEBUG, `Outputs:`, {
        current: currentOutputs,
        resolved: entry.element.getOutputs().map((o) => o.getValue()),
      });

      const propTo = entry.element
        .getOutputs()
        .filter(
          (o, i) =>
            entry?.element instanceof Input ||
            (o.getValue() == null && currentOutputs[i] != null) ||
            (o.getValue() != null &&
              !(o.getValue() as BitString).equals(currentOutputs[i])),
        )
        .map(
          (o) => (o.setLastUpdate((entry as QueueEntry).time), o.getElements()),
        )
        .flat()
        // Ensure that whatever the current element would propagate to actually has the element as an
        // input; some elements (the Splitter) may misbehave and attempt to propagate things to elements
        // which are attached upstream. This prevents those from being re-resolved which results in resolving
        // the current element again, causing an infinite loop.
        .filter((e) =>
          e
            .getInputs()
            .map((i) => i.getElements())
            .flat()
            .includes((entry as QueueEntry).element),
        );

      for (const el of propTo) {
        const entryInd = eventQueue.map((e) => e.element).indexOf(el);
        if (entryInd != -1) {
          this.#log(LogLevel.TRACE, `Already in event queue: ${el}`);

          if (propDelay) {
            this.#log(
              LogLevel.TRACE,
              `Delaying resolution until t = ${time + propDelay}`,
            );
            eventQueue[entryInd].time = time + propDelay;
          }

          continue;
        }

        this.#log(LogLevel.TRACE, `Propagating to element: ${el}]`);
        eventQueue.push({
          time: time + propDelay,
          element: el,
        });
      }

      eventQueue.sort((a, b) => a.time - b.time);
      steps++;
      this.#log(
        LogLevel.TRACE,
        `Event Queue:`,
        eventQueue.map((e) => `[t = ${e.time}] ${e.element}`),
      );

      if (steps > 1000000) {
        throw new Error(
          "Resolution step limit exceeded; check for loops in circuit.",
        );
      }
    }

    this.#log(LogLevel.TRACE, "Resolution completed. Collecting outputs...");
    let output;

    // Return circuit outputs
    // Regardless of whether the user submitted a string or a BitString
    // for the inputs, BitStrings will be returned as they preserve information
    // such as the bus width of the output.
    if (Array.isArray(inputs)) {
      this.#log(LogLevel.TRACE, "Building output as array.");
      output = {
        outputs: Object.values(this.#outputs).map((o) => o.getValue()),
        propagationDelay: time,
        steps: steps,
      };
    } else {
      this.#log(LogLevel.TRACE, "Building output as object.");
      const outputs: Record<string, BitString | null> = {};

      for (const key of Object.keys(this.#outputs)) {
        outputs[key] = this.#outputs[key].getValue();
      }

      output = {
        outputs: outputs,
        propagationDelay: time,
        steps: steps,
      };
    }

    this.#log(LogLevel.INFO, `Resolved circuit with outputs:`, output);

    // @ts-ignore
    return output;
  }
}
