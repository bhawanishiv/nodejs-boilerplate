import winston, { Logger, transport } from 'winston';

import { ENVIRONMENT } from './env';

const enumerateErrorFormat = winston.format((info) => {
  if (info instanceof Error) {
    Object.assign(info, { message: info.stack });
  }
  return info;
});

const transports: transport[] = [
  new winston.transports.Console({
    stderrLevels: ['error'],
  }),
];

if (ENVIRONMENT === 'development') {
  transports.push(
    new winston.transports.File({
      filename: 'logs/info.log',
    }),
  );
}

const logger: Logger = winston.createLogger({
  level: ENVIRONMENT === 'development' ? 'debug' : 'info',
  format: winston.format.combine(
    enumerateErrorFormat(),
    ENVIRONMENT === 'development'
      ? winston.format.colorize()
      : winston.format.uncolorize(),
    winston.format.splat(),
    winston.format.printf(({ level, message }) => `${level}: ${message}`),
  ),
  transports,
});

export default logger;
