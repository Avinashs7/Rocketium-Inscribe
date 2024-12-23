const winston = require('winston');
const fs = require('fs');
const path = require('path');
const DailyRotateFile = require('winston-daily-rotate-file');
const { environment, logDirectory } = require('../config');

const { timestamp, label, printf } = winston.format;

let dir = logDirectory;
if (!dir) dir = path.resolve('logs');

if (environment !== 'production' && !fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });  
}

const customColors = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'cyan',
};

winston.addColors(customColors);

const logLevel = environment === 'development' ? 'debug' : 'warn';

const logFormat = printf(({ level, message, label, timestamp }) => {
    return `[${label}] [${level}]: ${message} ${timestamp}`;
});

const transports = [
    new winston.transports.Console({
        level: logLevel,
        format: winston.format.combine(
            winston.format.errors({ stack: true }),
            label({ label: 'Logging' }),
            timestamp(),
            winston.format.colorize(),
            logFormat,
        ),
    }),
];

if (environment !== 'production') {
    const dailyRotateFile = new DailyRotateFile({
        level: logLevel,
        filename: dir + '/%DATE%.log',
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        handleExceptions: true,
        maxSize: '20m',
        maxFiles: '14d',
        format: winston.format.combine(
            winston.format.errors({ stack: true }),
            winston.format.timestamp(),
            timestamp(),
        ),
    });
    transports.push(dailyRotateFile);
}

const logger = winston.createLogger({
    transports: transports,
    exceptionHandlers: [new DailyRotateFile({
        level: logLevel,
        filename: dir + '/%DATE%.log',
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        handleExceptions: true,
        maxSize: '20m',
        maxFiles: '14d',
        format: winston.format.combine(
            winston.format.errors({ stack: true }),
            winston.format.timestamp(),
            timestamp(),
        ),
    })],
    exitOnError: false,
});

module.exports = logger;
