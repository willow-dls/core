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

import { CircuitLogger, LogLevel, logLevelString } from "../CircuitLogger.js";

/**
 * A logger implementation that outputs a human-readable log using JavaScript's `console.log()`.
 * This implementation is useful when running this engine standalone and not a part of a unit
 * testing framework, which may clobber the log output or not show it at all. For example, Jest
 * really does not like this logger, as each `console.log()` call gets a backtrace printed
 * under it, making the log much, much larger and spaced out than it needs to be. For logging
 * in Jest, use the {@link FileLogger}.
 */
export class ConsoleLogger extends CircuitLogger {
  output(
    count: number,
    timestamp: Date,
    level: LogLevel,
    subsystem: string,
    msg: string,
    data?: any,
  ): void {
    const header = `[${timestamp.toLocaleString()}] ${logLevelString[level]}[${count}] ${subsystem}: `;
    console.log(`${header}${msg}`);
    if (data) {
      Object.keys(data).forEach((key) => {
        console.log(
          `${" ".repeat(header.length)}${key}: ${JSON.stringify(data[key])}`,
        );
      });
    }
  }
}
