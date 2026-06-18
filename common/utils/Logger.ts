import winston from 'winston';
import path from 'path';
import fs from 'fs';

function getCallerInfo(): { file: string; line: string } {
  const stack = new Error().stack?.split('\n');
  if (!stack) return { file: 'unknown', line: '?' };

  const callerLine = stack.find(
    (line) =>
      line.match(/\.(ts|js):\d+:\d+\)?$/) &&
      !line.includes('logger') &&
      !line.includes('Logger') &&
      !line.includes('winston') &&
      !line.includes('node_modules') &&
      !line.includes('internal/')
  );

  if (!callerLine) return { file: 'unknown', line: '?' };

  const match = callerLine.match(/(?:\()?(.*\.(?:ts|js)):(\d+):\d+\)?/);
  if (!match) return { file: 'unknown', line: '?' };

  const fullPath = match[1];
  const line = match[2];
  const fullFileName = path.basename(fullPath);
  return { file: fullFileName, line };
}

const PREFIX_COLOR = '\x1b[36m'; // cyan
const RESET_COLOR = '\x1b[0m';

export function initLogger(contextName?: string) {
  const logsDir = path.resolve('logs');
  if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir, { recursive: true });

  const { file: callerFile } = getCallerInfo();
  const baseFileName = contextName || callerFile;
  const _logPath = path.join(logsDir, `${baseFileName}.log`);

  const injectLineInfo = winston.format((info) => {
    const { file, line } = getCallerInfo();
    info.file = file;
    info.line = line;
    return info;
  });

  const consoleFormat = winston.format.combine(
    injectLineInfo(),
    winston.format.timestamp({ format: 'DD-MM-YYYY HH:mm:ss' }),
    winston.format.colorize({ all: false }),
    winston.format.printf(({ timestamp, level, message, file, line }) => {
      const prefix = `${PREFIX_COLOR}[${timestamp}] [${file}:${line}]${RESET_COLOR}`;
      return `${prefix} ${level}: ${message}`;
    })
  );

  const fileFormat = winston.format.combine(
    injectLineInfo(),
    winston.format.timestamp({ format: 'DD-MM-YYYY HH:mm:ss' }),
    winston.format.printf(({ timestamp, level, message, file, line }) => {
      return `[${timestamp}] [${file}:${line}] ${level.toUpperCase()}: ${message}`;
    })
  );

  return winston.createLogger({
    level: 'info',
    format: fileFormat,
    transports: [
      new winston.transports.Console({ format: consoleFormat }),
      // new winston.transports.File({ filename: _logPath }), // uncomment if you want logs files.
    ],
  });
}
