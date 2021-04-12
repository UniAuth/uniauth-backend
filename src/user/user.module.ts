import * as mongooseUniquevalidator from 'mongoose-unique-validator';
import { WinstonModule } from 'nest-winston';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UserController } from './user.controller';
import { UserSchema } from './user.schema';
import { UserService } from './user.service';
import { LoggerConfig } from '../logger/LoggerConfig';

const logger: LoggerConfig = new LoggerConfig();

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: 'User',
        useFactory: () => {
          const schema = UserSchema;
          schema.plugin(mongooseUniquevalidator);
          return schema;
        },
      },
    ]),
    WinstonModule.forRoot(logger.console()),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
