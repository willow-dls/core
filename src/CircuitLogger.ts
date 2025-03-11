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

    #id: number;

    static #counter: number = 0;

    constructor(subsystem: string) {
        this.#subsystem = subsystem;
        this.#id = CircuitLoggable.#counter++;
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
        this.#loggers.forEach(l => loggable.attachLogger(l));
        this.#children.add(loggable);
    }

    /**
     * Everything that is loggable gets a unique ID, which can help identify instances
     * of objects in logs when many such instances exist.
     * 
     * @returns A unique ID among all loggable objects.
     */
    getId(): number {
        return this.#id;
    }

    protected log(level: LogLevel, msg: string, data?: any): void {
        this.#loggers.forEach(l => l.log(level, this.#subsystem, msg, data));
    }
}