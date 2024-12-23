const winston = require('winston');
const fs = require('fs');
const path = require('path');
const DailyRotateFile = require('winston-daily-rotate-file');
const { environment, logDirectory } = require( '../config');

const { timestamp, label, printf } = winston.format;
let dir = logDirectory;
if (!dir) dir = path.resolve('logs');

if (!fs.existsSync(dir)) {
    // Create the directory if it does not exist
    fs.mkdirSync(dir);
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

const logger=winston.createLogger({
    transports: [
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
        dailyRotateFile,
    ],
    exceptionHandlers: [dailyRotateFile],
    exitOnError: false,
});
module.exports=logger; 