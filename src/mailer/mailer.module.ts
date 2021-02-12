import { Module } from '@nestjs/common';
import { MailerController } from './mailer.controller';
import { MailerService } from './mailer.service';
import { JwtModule} from '@nestjs/jwt';
import { confirmEmailTokenConstants } from './constants/confirmEmailToken.constants';
import { AccountModule } from 'src/account/account.module';




@Module({
  imports: [
    JwtModule.register({
      secret: confirmEmailTokenConstants.secret,
      signOptions: { expiresIn: confirmEmailTokenConstants.expiresIn },
    }),
    AccountModule
    ],
    
  controllers: [MailerController],
  providers: [MailerService]
})
export class MailerModule {}
