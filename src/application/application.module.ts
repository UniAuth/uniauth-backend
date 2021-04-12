import * as mongooseUniquevalidator from 'mongoose-unique-validator';
import { WinstonModule } from 'nest-winston';

import { Application, ApplicationSchema } from './application.schema';
import { User, UserSchema } from '../user/user.schema';

import { ApplicationController } from './application.controller';
import { ApplicationService } from './application.service';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LoggerConfig } from '../logger/LoggerConfig';

const logger: LoggerConfig = new LoggerConfig();

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: User.name,
        useFactory: () => {
          const schema = UserSchema;
          schema.plugin(mongooseUniquevalidator);
          return schema;
        },
      },
      {
        name: Application.name,
        useFactory: () => {
          const schema = ApplicationSchema;
          schema.plugin(mongooseUniquevalidator);
          return schema;
        },
      },
    ]),
    WinstonModule.forRoot(logger.console()),
  ],
  controllers: [ApplicationController],
  providers: [ApplicationService],
  exports: [ApplicationService],
})
export class ApplicationModule {}
