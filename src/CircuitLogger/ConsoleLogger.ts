import { CircuitLogger, LogLevel, logLevelString } from "../CircuitLogger";

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
