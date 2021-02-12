import { Module } from '@nestjs/common';
import { MailerController } from './mailer.controller';
import { MailerService } from './mailer.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { accessTokenJwtConstants } from '../account/constants/access_token.constants';
import { AccountModule } from 'src/account/account.module';
import { AccountService } from 'src/account/account.service';
import { ApplicationService } from 'src/application/application.service';
import { AuthService } from 'src/auth/auth.service';
import { UserService } from 'src/user/user.service';



@Module({
  imports: [
    JwtModule.register({
      secret: accessTokenJwtConstants.secret,
      signOptions: { expiresIn: accessTokenJwtConstants.expiresIn },
    }),
    ],
  controllers: [MailerController],
  providers: [MailerService,AccountService]
})
export class MailerModule {}
