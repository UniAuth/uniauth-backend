import { JwtModule, JwtService } from '@nestjs/jwt';
import { User, UserSchema } from '../user/user.schema';

import { MailerController } from './mailer.controller';
import { MailerService } from './mailer.service';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from '../user/user.module';
import { confirmEmailTokenConstants } from './constants/confirmEmailToken.constants';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.register({
      secret: confirmEmailTokenConstants.secret,
      signOptions: { expiresIn: confirmEmailTokenConstants.expiresIn },
    }),
    UserModule,
  ],
  controllers: [MailerController],
  providers: [MailerService],
  exports: [MailerService],
})
export class MailerModule {}
