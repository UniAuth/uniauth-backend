import * as config from 'config';
import * as cookieParser from 'cookie-parser';
import * as rateLimit from 'express-rate-limit';
import * as hbs from 'hbs';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { NestFactory } from '@nestjs/core';
import { join } from 'path';
import { WinstonModule } from 'nest-winston';
import { LoggerConfig } from './logger/LoggerConfig';

const logger: LoggerConfig = new LoggerConfig();

/**
 * Bootstrap application by attaching middleware and initializing auxillary services
 * @internal
 */
async function bootstrap() {
  /** set the logging levels */
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: WinstonModule.createLogger(logger.console()),
  });

  /** configuring public and views directory */
  app.useStaticAssets(join(__dirname, '../..', 'public'));
  app.setBaseViewsDir(join(__dirname, '../..', 'views'));
  hbs.registerPartials(join(__dirname, '../../views', 'partials'));

  app.setViewEngine('hbs');
  console.log(__dirname);

  /** configuring swaggerUI */
  const options = new DocumentBuilder()
    .setTitle(config.get('api.name'))
    .setDescription(config.get('api.description'))
    .setVersion(config.get('api.version'))
    .setContact('Yash Kumar Verma', 'https://yashkumarverma.github.io/', 'yk.verma2000@gmail.com')
    .setLicense('MIT', 'https://opensource.org/licenses/MIT')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'access-token')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup(config.get('api.route'), app, document);

  /** attaching middleware */
  app.enableCors();
  //   app.use(helmet());

  /**
   * windowMs : time interval
   * max: number of requests
   *
   * this will allow max number of requests every windowMs seconds
   */
  app.use(
    rateLimit({
      windowMs: 1000 * 1,
      max: 10,
    }),
  );

  /** attach cookie parser */
  app.use(cookieParser());

  /** binding port to service */
  await app.listen(config.get('server.port'));
}

/** launch the application */
bootstrap();
