import { JwtModule } from '@nestjs/jwt';
import { WinstonModule } from 'nest-winston';
import { User, UserSchema } from '../user/user.schema';

import { MailerController } from './mailer.controller';
import { MailerService } from './mailer.service';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from '../user/user.module';
import { confirmEmailTokenConstants } from './constants/confirmEmailToken.constants';
import { LoggerConfig } from '../logger/LoggerConfig';

const logger: LoggerConfig = new LoggerConfig();
@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.register({
      secret: confirmEmailTokenConstants.secret,
      signOptions: { expiresIn: confirmEmailTokenConstants.expiresIn },
    }),
    UserModule,
    WinstonModule.forRoot(logger.console()),
  ],
  controllers: [MailerController],
  providers: [MailerService],
  exports: [MailerService],
})
export class MailerModule {}
