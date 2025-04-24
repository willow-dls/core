/*
 * Copyright (c) 2025 Jordan Bancino <jordan@bancino.net>
 * Copyright (c) 2025 Austin Hargis <hargisa@mail.gvsu.edu>
 * Copyright (c) 2025 Aaron MacDougall <macdouaa@mail.gvsu.edu>
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import { BitString } from "../BitString";
import { CircuitBus } from "../CircuitBus";
import { LogLevel } from "../CircuitLogger";
import { SequentialElement } from "./SequentialElement";

/**
 * The counter element simply increments its output line on each rising edge
 * of the clock. When the output value reaches the maximum, it rolls over to
 * zero.
 */
export class Counter extends SequentialElement {
  /**
   * Create a new counter element.
   * @param maxValue The maximum value that the counter can be before rolling over to zero.
   * @param clock The clock signal.
   * @param reset When this bus goes high, the count is immediately reset to zero.
   * @param output The output bus.
   * @param zero An output line which goes high when the counter rolled over due to hitting
   * the max value. It goes high only on the clock cycle which the counter was reset.
   */
  constructor(
    maxValue: CircuitBus,
    clock: CircuitBus,
    reset: CircuitBus,
    output: CircuitBus,
    zero: CircuitBus,
  ) {
    super("CounterElement", clock, [maxValue, reset], [output, zero]);
  }

  // resolve() is called whenever an input changes, either the maxValue, clock, or reset line.
  onResolve(): void {
    const [clock, maxValue, reset] = this.getInputs();
    const [output, zero] = this.getOutputs();

    this.log(LogLevel.TRACE, `Before resolve():`, {
      maxValue: maxValue.getValue(),
      reset: reset.getValue(),
      output: output.getValue(),
      zero: zero.getValue(),
    });

    // If reset is high, zero the output
    if (reset.getValue()?.equals("1")) {
      this.log(LogLevel.TRACE, `Reset is high, zeroing output...`);
      output.setValue(BitString.low());
    }

    this.log(LogLevel.TRACE, `After resolve():`, {
      maxValue: maxValue.getValue(),
      reset: reset.getValue(),
      output: output.getValue(),
      zero: zero.getValue(),
    });
  }

  onClockRise(): void {
    const [clock, maxValue] = this.getInputs();
    const [output, zero] = this.getOutputs();

    // If the current value is greater than the max value, reset to zero
    if (output.getValue()?.greaterThan(maxValue.getValue())) {
      this.log(LogLevel.TRACE, `Counter value exceeded max value, zeroing...`);
      output.setValue(BitString.low());
      zero.setValue(BitString.high());
    } else {
      const one = new BitString("1", output.getWidth());
      const current = output.getValue() ?? BitString.low(output.getWidth());

      this.log(
        LogLevel.TRACE,
        `Rising edge of clock: ${current} + ${one} => ${current.add(one)}`,
      );

      output.setValue(current.add(one));
      zero.setValue(BitString.low());

      this.log(LogLevel.TRACE, `New Value: ${output.getValue()}`);
    }
  }

  onClockFall(): void {}

  reset(): void {
    super.reset();

    const [output] = this.getOutputs();
    output.setValue(BitString.low(output.getWidth()));
    //this.getOutputs().forEach(o => o.setValue(BitString.low()));
  }
}
