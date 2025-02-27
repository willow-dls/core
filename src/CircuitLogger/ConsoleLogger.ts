import { CircuitLogger, LogLevel, logLevelString } from "../CircuitLogger";

export class ConsoleLogger extends CircuitLogger {
    output(count: number, timestamp: Date, level: LogLevel, subsystem: string, msg: string, data?: any): void {
        const header = `[${timestamp.toLocaleString()}] ${logLevelString[level]}[${count}] ${subsystem}: `;
        console.log(`${header}${msg}`);
        if (data) {
            Object.keys(data).forEach((key) => {
                console.log(`${' '.repeat(header.length)}${key}: ${JSON.stringify(data[key])}`);
            });
        }
    }
}
