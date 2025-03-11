import { Stream } from "node:stream";
import { CircuitLogger, LogLevel, logLevelString } from "../CircuitLogger";
import { createWriteStream, WriteStream } from "node:fs";

export class FileLogger extends CircuitLogger {
    #file: WriteStream;

    constructor(file: string | WriteStream) {
        super();

        if (file instanceof WriteStream) {
            this.#file = file;
        } else {
            this.#file = createWriteStream(file);
        }
    }

    output(count: number, timestamp: Date, level: LogLevel, subsystem: string, msg: string, data?: any): void {
        const header = `[${timestamp.toLocaleString()}] ${logLevelString[level]}[${count}] ${subsystem}: `;
        this.#file.write(`${header}${msg}\n`);
        if (data) {
            Object.keys(data).forEach((key) => {
                this.#file.write(`${' '.repeat(header.length)}${key}: ${JSON.stringify(data[key])}\n`);
            });
        }
    }

    close() {
        this.#file.close();
    }
}
