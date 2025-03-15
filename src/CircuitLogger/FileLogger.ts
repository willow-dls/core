import { Stream } from "node:stream";
import { CircuitLogger, LogLevel, logLevelString } from "../CircuitLogger";
import { createWriteStream, WriteStream } from "node:fs";

export class FileLogger extends CircuitLogger {
    #file: WriteStream;
    #isClosed: boolean = false;

    #write(data: string) {
        this.#file.write(data);
    }

    constructor(file: string | WriteStream) {
        super();

        if (file instanceof WriteStream) {
            this.#file = file;
        } else {
            this.#file = createWriteStream(file);
        }

        process.once('uncaughtException', async (err) => {
            this.#file.on('close', () => {
                throw err;
            });

            await this.close();
        });

        process.once('unhandledRejection', async (reason, promise) => {
            await this.close();
        });

        process.on('exit', async (code) => {
            await this.close();
        });
    }

    output(count: number, timestamp: Date, level: LogLevel, subsystem: string, msg: string, data?: any): void {
        const header = `[${timestamp.toLocaleString()}] ${logLevelString[level]}[${count}] ${subsystem}: `;
        this.#write(`${header}${msg}\n`);
        if (data) {
            Object.keys(data).forEach((key) => {
                this.#write(`${' '.repeat(header.length)}${key}: ${JSON.stringify(data[key])}\n`);
            });
        }
    }

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
