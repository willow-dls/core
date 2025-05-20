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
import { createWriteStream, WriteStream } from "node:fs";

/**
 * A logger implementation that outputs a human-readable log file using the NodeJS
 * stream API. This implementation is useful for writing out circuit executions to
 * a file so that they can be debugged offline after the execution, as it is fairly
 * normal for large circuits to produce large amount of log output.
 *
 * This logger requires a file name or write stream, and should be closed properly
 * with {@link close} when circuit execution is complete.
 */
export class FileLogger extends CircuitLogger {
  #file: WriteStream;
  #isClosed: boolean = false;

  #write(data: string) {
    this.#file.write(data);
  }

  /**
   * Construct a new file logger, outputting to the given file or stream.
   * @param file The file path or a write stream to write log output to. Note that
   * the file will be overwritten if it exists, not appended to.
   */
  constructor(file: string | WriteStream) {
    super();

    if (file instanceof WriteStream) {
      this.#file = file;
    } else {
      this.#file = createWriteStream(file);
    }

    process.once("uncaughtException", async (err) => {
      this.#file.on("close", () => {
        throw err;
      });

      await this.close();
    });

    process.once("unhandledRejection", async (reason, promise) => {
      await this.close();
    });

    process.on("exit", async (code) => {
      await this.close();
    });
  }

  output(
    count: number,
    timestamp: Date,
    level: LogLevel,
    subsystem: string,
    msg: string,
    data?: any,
  ): void {
    const header = `[${timestamp.toLocaleString()}] ${logLevelString[level]}[${count}] ${subsystem}: `;
    this.#write(`${header}${msg}\n`);
    if (data) {
      Object.keys(data).forEach((key) => {
        this.#write(
          `${" ".repeat(header.length)}${key}: ${JSON.stringify(data[key])}\n`,
        );
      });
    }
  }

  /**
   * Close the log file, making sure all writes get flushed to the disk.
   * @returns A promise that is fulfilled when all writes are complete.
   */
  async close(): Promise<void> {
    if (!this.#isClosed) {
      this.#isClosed = true;
      return new Promise<void>((resolve, reject) => {
        this.#file.end(() => {
          this.#file.close((err) => {
            if (err) {
              reject(err);
            } else {
              resolve();
            }
          });
        });
      });
    }
  }
}
