export enum LogLevel {
    TRACE,
    DEBUG,
    INFO,
    WARN,
    ERROR,
    FATAL
};

export const logLevelString = [
    'TRACE',
    'DEBUG',
    'INFO',
    'WARNING',
    'ERROR',
    'FATAL'
];

export abstract class CircuitLogger {
    #level: LogLevel = LogLevel.WARN;
    #subsystems: Set<RegExp> = new Set<RegExp>([]);
    #count: number = 0;

    setLevel(level: LogLevel): CircuitLogger {
        this.#level = level;
        return this;
    }

    setSubsystems(...subsystems: RegExp[]): CircuitLogger {
        this.#subsystems = new Set(subsystems);
        return this;
    }

    #subsystemMatches(subsystem: string): boolean {
        if (!this.#subsystems.size) {
            return true;
        }

        for (const regex of this.#subsystems) {
            if (regex.test(subsystem)) {
                return true;
            }
        }

        return false;
    }

    attachTo(loggable: CircuitLoggable): CircuitLogger {
        loggable.attachLogger(this);
        return this;
    }

    detachFrom(loggable: CircuitLoggable): CircuitLogger {
        loggable.detachLogger(this);
        return this;
    }

    log(level: LogLevel, subsystem: string, msg: string, data?: any): void {
        if (level < this.#level) {
            return;
        }

        if (this.#subsystemMatches(subsystem)) {
            const timestamp = new Date();
            this.#count++;
            this.output(
                this.#count,
                timestamp,
                level,
                subsystem, 
                msg, 
                data
            );
        }
    }

    abstract output(
        count: number,
        timestamp: Date, 
        level: LogLevel, 
        subsystem: string,
        msg: string, 
        data?: any
    ): void;
}

export abstract class CircuitLoggable {
    #subsystem: string;
    #loggers: Set<CircuitLogger> = new Set([]);
    #children: Set<CircuitLoggable> = new Set([]);

    constructor(subsystem: string) {
        this.#subsystem = subsystem;
    }

    attachLogger(logger: CircuitLogger): void {
        this.#loggers.add(logger);
        this.#children.forEach((child) => child.attachLogger(logger));
    }
    
    detachLogger(logger: CircuitLogger): void {
        this.#loggers.delete(logger);
        this.#children.forEach((child) => child.detachLogger(logger));
    }

    propagateLoggersTo(loggable: CircuitLoggable): void {
        loggable.#loggers = new Set(this.#loggers);
        this.#children.add(loggable);
    }

    protected log(level: LogLevel, msg: string, data?: any): void {
        this.#loggers.forEach(l => l.log(level, this.#subsystem, msg, data));
    }
}