import * as winston from 'winston';
import { utilities as nestWinstonModuleUtilities } from 'nest-winston';

const consoleOptions = {
  format: winston.format.combine(
    winston.format.timestamp(),
    nestWinstonModuleUtilities.format.nestLike(),
    winston.format.colorize(),
  ),
  level: 'silly',
};

/**
 * @description Configuration for Winston logger
 */
export class LoggerConfig {
  private readonly options: winston.LoggerOptions;

  constructor() {
    this.options = {
      transports: [
        new winston.transports.Console(consoleOptions),
        new winston.transports.File({ filename: 'application.log', level: 'info' }),
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'app-log.log', level: 'warn' }),
        new winston.transports.File({ filename: 'verbose.log', level: 'verbose' }),
      ],
    };
  }

  public console(): winston.LoggerOptions {
    return this.options;
  }
}
