import * as winston from 'winston';
import { utilities as nestWinstonModuleUtilities } from 'nest-winston';

/**
 * @description Configuration for Winston logger
 */
export class LoggerConfig {
  private readonly options: winston.LoggerOptions;

  constructor() {
    this.options = {
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            nestWinstonModuleUtilities.format.nestLike(),
            winston.format.colorize(),
          ),
        }),
        new winston.transports.File({ filename: 'application.log', level: 'info' }),
        new winston.transports.File({ filename: 'app-log.log', level: 'log' }),
        new winston.transports.File({ filename: 'verbose.log', level: 'verbose' }),
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
      ],
    };
  }

  public console(): winston.LoggerOptions {
    return this.options;
  }
}
