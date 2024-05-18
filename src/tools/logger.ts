import { createLogger, transports, format } from "winston";
import { logLevel } from "kafkajs";

const toWinstonLogLevel = level => {
    switch(level) {
        case logLevel.ERROR:
        case logLevel.NOTHING:
            return 'error'
        case logLevel.WARN:
            return 'warn'
        case logLevel.INFO:
            return 'info'
        case logLevel.DEBUG:
            return 'debug'
    }
}

export const kafkaLogger = logLevel => {
    const logger = createLogger({
        level: toWinstonLogLevel(logLevel),
        transports: [
            new transports.Console(),
        ]
    })

    return ({ namespace, level, label, log }: { 
        namespace: string, 
        level: logLevel, 
        label: string, 
        log: { message: string, [key: string]: any } 
    }) => {
        const { message, ...extra } = log;
        logger.log({
            level: toWinstonLogLevel(level),
            message,
            extra,
            namespace,
            label
        });
    };
}

export const logger = createLogger({
    transports: [new transports.Console()],
    format: format.combine(
        format.colorize(),
        format.timestamp(),
        format.printf(({ timestamp, level, message }) => {
        return `[${timestamp}] ${level}: ${message}`;
        })
    ),
});
