import { MailerController } from './mailer.controller';
import { MailerService } from './mailer.service';
import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { confirmEmailTokenConstants } from './constants/confirmEmailToken.constants';
import { UserModule } from 'src/user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/user/user.schema';




@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema }]),
    JwtModule.register({
      secret: confirmEmailTokenConstants.secret,
      signOptions: { expiresIn: confirmEmailTokenConstants.expiresIn },
    }),
    UserModule
    ],
  controllers: [MailerController],
  providers: [MailerService],
  exports : [MailerService]
})
export class MailerModule {}
