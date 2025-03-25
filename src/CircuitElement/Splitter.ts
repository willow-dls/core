import { BitString } from "../BitString";
import { CircuitBus } from "../CircuitBus";
import { CircuitElement } from "../CircuitElement";
import { LogLevel } from "../CircuitLogger";

export class Splitter extends CircuitElement {
  #split: number[];
  #prevInput: BitString | null;
  #prevOutputs: (BitString | null)[] | null;
  #lastOp: string | null;

  #bitStringsEqual(a: (BitString | null)[], b: (BitString | null)[]): boolean {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length !== b.length) return false;

    for (var i = 0; i < a.length; ++i) {
      if (a[i] == b[i]) {
        continue;
      }

      if (a[i] == null || b[i] == null) {
        return false;
      }

      // Can't be null because they're not the same and neither are
      // null.
      if (!(a[i] as BitString).equals(b[i])) return false;
    }
    return true;
  }

  #nullOutputs(a: (BitString | null)[]): boolean {
    for (const x of a) {
      if (x == null) {
        return true;
      }
    }
    return false;
  }

  #earliestOutput(): number {
    let o = -1;
    for (const x of super.getOutputs().slice(1)) {
      if (x == null) {
        continue;
      }

      o = Math.min(o, x.getLastUpdate());
    }

    return o;
  }

  #propOut(input: BitString) {
    this.log(LogLevel.TRACE, "Splitting input into outputs...");
    let off = 0;

    for (const s in this.#split) {
      let i = this.#split.length - 1 - parseInt(s);

      const split = this.#split[i];
      const output = super.getOutputs().slice(1)[i];

      this.log(LogLevel.TRACE, `Computing ${input}[${off}:${off + split}]...`);
      const value = input.substring(off, off + split);
      this.log(LogLevel.TRACE, `Got value: ${value}`);

      output.setValue(value);

      off += split;
    }

    this.#lastOp = "propOut";
  }

  #propIn() {
    this.log(LogLevel.TRACE, "Combining outputs into input...");
    let newOut = "";

    for (let s in this.#split) {
      let i = this.#split.length - 1 - parseInt(s);
      const split = this.#split[i];
      const output = super.getOutputs().slice(1)[i];
      const val = output.getValue();

      if (output.getWidth() != split) {
        throw new Error(
          `SplitterElement bus width error: Received ${output.getWidth()}-bit value on ${split}-bit bus.`,
        );
      }

      newOut += val?.toString() ?? BitString.low(output.getWidth());
    }

    this.log(LogLevel.TRACE, `Propagating '${newOut}' to input.`);
    this.getInputs()[0].setValue(new BitString(newOut));

    this.#lastOp = "propIn";
  }

  #getValues(): [BitString | null, (BitString | null)[]] {
    const input: BitString | null = this.getInputs()[0].getValue();
    const outputs: (BitString | null)[] = super
      .getOutputs()
      .slice(1)
      .map((o) => o.getValue());
    return [input, outputs];
  }

  constructor(split: number[], input: CircuitBus, outputs: CircuitBus[]) {
    // This is a bi-directional element, so it's behavior depends on whether
    // the input changed (split input into outputs) or an output changed (combine
    // outputs into input.)
    // Therefore, both the inputs and outputs function as the other as well
    // and must be connected as such so that resolve() is called when either
    // the inputs OR the outputs change. We will detect which happened in
    // the abomination which is below.
    super("SplitterElement", [input, ...outputs], [input, ...outputs]);

    this.#split = split;
    this.#prevInput = null;
    this.#prevOutputs = null;
    this.#lastOp = null;
  }

  resolve(): number {
    this.log(LogLevel.TRACE, `Resolving splitter...`);
    const [input, outputs] = this.#getValues();

    // if (!this.#prevInput || !this.#prevOutputs) {
    //     this.#prevInput = input;
    //     this.#prevOutputs = outputs;
    // }

    if (!input) {
      if (!this.#nullOutputs(outputs)) {
        this.log(LogLevel.TRACE, `No input, but all outputs are present.`);
        this.#propIn();
      } else {
        this.log(
          LogLevel.TRACE,
          `No input value and there are missing output values.`,
        );
        this.log(LogLevel.TRACE, `Doing nothing.`);
      }
    } else {
      if (this.#nullOutputs(outputs)) {
        this.log(
          LogLevel.TRACE,
          `Input provided, and some outputs are missing.`,
        );
        this.#propOut(input);
      } else {
        this.log(
          LogLevel.TRACE,
          `Both input and all outputs are present, seeing what changed...`,
        );

        const inputUpdate = this.getInputs()[0].getLastUpdate();
        const outputUpdate = this.#earliestOutput();

        const inputChanged = !input.equals(this.#prevInput);
        const outputsChanged = !this.#bitStringsEqual(
          this.#prevOutputs ?? [],
          outputs,
        );

        this.log(
          LogLevel.TRACE,
          `Inputs changed: ${inputChanged}, last update = ${inputUpdate}`,
        );
        this.log(
          LogLevel.TRACE,
          `Outputs changed: ${outputsChanged}, last update = ${outputUpdate}`,
        );

        if (inputChanged && inputUpdate < outputUpdate) {
          this.#propOut(input);
        } else if (outputsChanged && outputUpdate < inputUpdate) {
          this.#propIn();
        } else {
          if (inputUpdate == outputUpdate && !input.equals(outputs.join(""))) {
            throw new Error(
              `Splitter contention: Both inputs and outputs were set and have changed at the same time: ${input} != ${this.#prevInput} && ${JSON.stringify(outputs)} != ${JSON.stringify(this.#prevOutputs)}`,
            );
          } else {
            // Do nothing.
            // Neither the input nor the output changed, or they changed at the
            // same time and are consistent.
          }
        }

        [this.#prevInput, this.#prevOutputs] = this.#getValues();
      }
    }

    return this.getPropagationDelay();
  }

  reset() {
    super.reset();

    this.#prevInput = null;
    this.#prevOutputs = null;
    this.#lastOp = null;
  }

  getOutputs(): CircuitBus[] {
    if (this.#lastOp == "propIn") {
      return [this.getInputs()[0]];
    } else {
      return super.getOutputs().slice(1);
    }
  }
}
